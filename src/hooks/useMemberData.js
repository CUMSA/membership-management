import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import scan from "../dynamo/query";
import transform from "../dynamo/transform";

export const DataRefreshContext = createContext(null);

const londonDate = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
});

export default function useMemberData(query) {
  const { user } = useAuthenticator((context) => [context.user]);
  const {
    refreshKey,
    requestRefresh,
    setRefreshStatus,
    isUpdating,
    setIsUpdating,
  } = useContext(DataRefreshContext);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState({
    isLoading: true,
    isStale: true,
    loadedAt: null,
    message: "",
  });
  const active = useRef(false);
  const updating = useRef(isUpdating);

  useEffect(() => {
    updating.current = isUpdating;
  }, [isUpdating]);

  useEffect(() => {
    setRefreshStatus(status);
  }, [status, setRefreshStatus]);

  useEffect(() => {
    const controller = new AbortController();
    let retryTimer;
    let finishDelay;
    active.current = true;

    const fetchData = async () => {
      setStatus((current) => ({ ...current, isLoading: true, message: "" }));
      for (let attempt = 0; attempt <= 3; attempt++) {
        if (attempt > 0) {
          setStatus((current) => ({
            ...current,
            isStale: true,
            message: `Failed to fetch data. Refetching, refetch attempt ${attempt}/3`,
          }));
          await new Promise((resolve) => {
            finishDelay = resolve;
            retryTimer = setTimeout(resolve, 1000 * 2 ** (attempt - 1));
          });
          if (controller.signal.aborted) return;
        }

        try {
          const token = user.getSignInUserSession().getIdToken().getJwtToken();
          const items = await scan(query, token, { signal: controller.signal });
          const rows = transform(items);
          if (controller.signal.aborted) return;
          setData(rows);
          setStatus({
            isLoading: false,
            isStale: Boolean(updating.current),
            loadedAt: new Date(),
            message: "",
          });
          return;
        } catch (error) {
          if (controller.signal.aborted) return;
          const httpStatus = error.response?.status;
          const retryable =
            error.isAxiosError &&
            (!httpStatus || httpStatus === 429 || httpStatus >= 500);
          if (!retryable || attempt === 3) {
            setStatus((current) => ({
              ...current,
              isLoading: false,
              isStale: true,
              message:
                httpStatus === 401 || httpStatus === 403
                  ? "Unable to fetch data. Please sign out and sign in again."
                  : "Failed to fetch data. Try again later, or reload the webpage.",
            }));
            return;
          }
        }
      }
    };
    fetchData();

    return () => {
      active.current = false;
      controller.abort();
      clearTimeout(retryTimer);
      finishDelay?.();
    };
  }, [query, user, refreshKey]);

  useEffect(() => {
    if (!status.loadedAt) return;
    const checkDate = () => {
      setStatus((current) =>
        current.loadedAt &&
        !current.isStale &&
        londonDate.format(new Date()) !== londonDate.format(current.loadedAt)
          ? { ...current, isStale: true }
          : current,
      );
    };
    const timer = setInterval(checkDate, 60000);
    window.addEventListener("focus", checkDate);
    document.addEventListener("visibilitychange", checkDate);
    checkDate();
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", checkDate);
      document.removeEventListener("visibilitychange", checkDate);
    };
  }, [status.loadedAt]);

  const markStale = useCallback(() => {
    if (!active.current) return;
    setStatus((current) => ({ ...current, isStale: true }));
    requestRefresh();
  }, [requestRefresh]);

  return {
    data,
    setData,
    ...status,
    user,
    isUpdating,
    setIsUpdating,
    markStale,
  };
}
