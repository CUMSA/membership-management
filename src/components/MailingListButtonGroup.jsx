import PropTypes from "prop-types";
import { useAuthenticator } from "@aws-amplify/ui-react";

import update from "../dynamo/update";
import { emailAddCamDomain } from "../utils/formatEmail";

const MailingListButtonGroup = ({
  data,
  setToastSetting,
  setData,
  disabled = false,
  setIsUpdating,
  onUpdateError,
}) => {
  const { user } = useAuthenticator((context) => [context.user]);

  const nameUpper = (name) => {
    return name
      .split(" ")
      .map((e) => `${e.charAt(0).toUpperCase()}${e.slice(1).toLowerCase()}`)
      .join(" ");
  };

  const handleCopy = () => {
    const text = data
      .map(
        (d) =>
          `${emailAddCamDomain(d.Crsid)} ${nameUpper(
            d.FirstName,
          )} ${nameUpper(d.LastName)}`,
      )
      .join("\n");
    navigator.clipboard.writeText(text);
    alert("Copied 'members to add to mailing list' to clipboard!");
  };

  const handleMarkAll = async () => {
    if (
      disabled ||
      !window.confirm(
        "You are about to mark ALL entries as in the mailing list. This is a dangerous operation that cannot be undone. Are you sure you want to continue?",
      )
    )
      return;
    setIsUpdating(true);
    try {
      const token = user.getSignInUserSession().getIdToken().getJwtToken();
      const results = await Promise.allSettled(
        data.map(({ Crsid }) =>
          update({ Action: "AddToMailingList", Crsid }, token),
        ),
      );
      if (results.some(({ status }) => status === "rejected"))
        throw new Error("Update failed");
      setToastSetting({
        visible: true,
        content: "Successfully set InMailingList for all users to True",
        severity: "success",
      });
      setData([]);
    } catch {
      onUpdateError();
      setToastSetting({
        visible: true,
        content:
          "Could not confirm mailing list updates. Refreshing data; review before retrying.",
        severity: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
      }}
    >
      <div>
        <button className="sympaCopyBtn" onClick={handleCopy}>
          Copy list
        </button>
      </div>
      <button className="markAll" onClick={handleMarkAll} disabled={disabled}>
        Mark all as in mail list
      </button>
    </div>
  );
};

MailingListButtonGroup.propTypes = {
  data: PropTypes.array.isRequired,
  setToastSetting: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  setIsUpdating: PropTypes.func.isRequired,
  onUpdateError: PropTypes.func.isRequired,
};

export default MailingListButtonGroup;
