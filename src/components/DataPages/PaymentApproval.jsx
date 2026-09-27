import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Button, MenuItem, Stack, TextField, Typography } from "@mui/material";

import scan from "../../dynamo/query";
import DataTable from "../DataTable";
import transform from "../../dynamo/transform";
import update from "../../dynamo/update";
import { byDate } from "../../utils/sortFuncs";

const sortByRegistrationTime = byDate(1);

const PaymentApproval = ({ isLoading, setIsLoading, setToastSetting }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const [data, setData] = useState([]);
  const [allCols, setAllCols] = useState([]);
  const [registrationFilter, setRegistrationFilter] = useState("pastMonth");
  const [selectedCrsids, setSelectedCrsids] = useState([]);
  const [isApproving, setIsApproving] = useState(false);

  const now = new Date();
  const julyYear = now.getFullYear() - (now.getMonth() < 6 ? 1 : 0);

  const filteredData = useMemo(() => {
    if (registrationFilter === "all") return data;

    const cutoff =
      registrationFilter === "sinceJuly"
        ? new Date(julyYear, 6, 1)
        : new Date();
    if (registrationFilter === "pastMonth") {
      const day = cutoff.getDate();
      cutoff.setDate(1);
      cutoff.setMonth(cutoff.getMonth() - 1);
      const lastDay = new Date(
        cutoff.getFullYear(),
        cutoff.getMonth() + 1,
        0,
      ).getDate();
      cutoff.setDate(Math.min(day, lastDay));
    }

    return data.filter(
      ({ RegistrationTime }) =>
        RegistrationTime && new Date(RegistrationTime) >= cutoff,
    );
  }, [data, registrationFilter, julyYear]);

  const handleSelectMember = (Crsid, checked) => {
    setSelectedCrsids((selected) =>
      checked ? [...selected, Crsid] : selected.filter((id) => id !== Crsid),
    );
  };

  const handleMarkSelectedPaid = async () => {
    if (isLoading || isApproving || selectedCrsids.length === 0) return;

    setIsApproving(true);
    try {
      const token = user.getSignInUserSession().getIdToken().getJwtToken();
      const results = await Promise.allSettled(
        selectedCrsids.map((Crsid) =>
          update({ Crsid, Action: "ConfirmPayment" }, token),
        ),
      );
      const approved = selectedCrsids.filter(
        (_, index) => results[index].status === "fulfilled",
      );
      const failed = selectedCrsids.filter(
        (_, index) => results[index].status === "rejected",
      );

      setData((current) =>
        current.filter(({ Crsid }) => !approved.includes(Crsid)),
      );
      setSelectedCrsids(failed);
      setToastSetting({
        visible: true,
        content:
          failed.length > 0
            ? `Approved ${approved.length} of ${selectedCrsids.length} payments. ${failed.length} failed and remain selected; try again.`
            : `Marked ${approved.length} ${approved.length === 1 ? "member" : "members"} as paid.`,
        severity: failed.length > 0 ? "error" : "success",
      });
    } catch {
      setToastSetting({
        visible: true,
        content: "Failed to approve payments. Try again later.",
        severity: "error",
      });
    } finally {
      setIsApproving(false);
    }
  };

  useEffect(() => {
    const token = user.getSignInUserSession().getIdToken().getJwtToken();
    setIsLoading(true);
    scan(
      {
        ExpressionAttributeValues: {
          ":p": {
            BOOL: false,
          },
        },
        FilterExpression: "Paid = :p",
      },
      token,
    )
      .then((r) => {
        setData(transform(r));
        setIsLoading(false);
        if (r.length > 0) {
          setAllCols(
            Object.keys(r[0]).map((k) => ({
              field: k,
              headerName: k,
              width: 150,
            })),
          );
        }
      })
      .catch(() => {
        setIsLoading(false);
        setToastSetting({
          visible: true,
          content: "Failed to fetch data. Try again later.",
          severity: "error",
        });
      });
  }, [setIsLoading, setToastSetting, user]);

  return (
    <>
      <div className="table-wrap">
        <Stack
          direction="row"
          spacing={2}
          useFlexGap
          sx={{ mb: 1, flexWrap: "wrap" }}
        >
          <TextField
            select
            label="Filter"
            value={registrationFilter}
            onChange={(event) => {
              setRegistrationFilter(event.target.value);
              setSelectedCrsids([]);
            }}
            disabled={isLoading || isApproving}
            size="small"
            sx={{ minWidth: 300 }}
          >
            <MenuItem value="pastMonth">Past 1 month</MenuItem>
            <MenuItem value="sinceJuly">Since July ({julyYear})</MenuItem>
            <MenuItem value="all">All</MenuItem>
          </TextField>
          <Button
            variant="contained"
            onClick={handleMarkSelectedPaid}
            disabled={isLoading || isApproving || selectedCrsids.length === 0}
            sx={{ alignSelf: "flex-start" }}
          >
            {isApproving
              ? "Approving..."
              : `Mark selected as paid (${selectedCrsids.length})`}
          </Button>
          <Button
            onClick={() => setSelectedCrsids([])}
            disabled={isApproving || selectedCrsids.length === 0}
            sx={{ alignSelf: "flex-start" }}
          >
            Clear selection
          </Button>
        </Stack>
        <Typography variant="body2" sx={{ my: 1 }}>
          {filteredData.length} of {data.length} unpaid members match the date
          filter. Selections are kept across pages and searches, and cleared
          when the date filter changes. Check each payment before approving;
          this action cannot be undone.
        </Typography>
        <DataTable
          rows={filteredData}
          allCols={allCols}
          selectedCrsids={selectedCrsids}
          onSelectRow={handleSelectMember}
          selectionDisabled={isLoading || isApproving}
          filterCols={[
            "Crsid",
            "MembershipType",
            "FirstName",
            "LastName",
            "RegistrationTime",
          ]}
          sortF={sortByRegistrationTime}
          searchCol={["Crsid", "FirstName", "LastName"]}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

PaymentApproval.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  setToastSetting: PropTypes.func.isRequired,
};

export default PaymentApproval;
