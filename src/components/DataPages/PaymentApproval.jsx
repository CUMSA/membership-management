import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import useMemberData from "../../hooks/useMemberData";
import DataTable from "../DataTable";
import update from "../../dynamo/update";
import { byDate } from "../../utils/sortFuncs";

const sortByRegistrationTime = byDate(1);

const memberQuery = {
  ExpressionAttributeValues: { ":p": { BOOL: false } },
  FilterExpression: "Paid = :p",
};

const PaymentApproval = ({ setToastSetting }) => {
  const {
    data,
    setData,
    user,
    isLoading,
    isStale,
    loadedAt,
    isUpdating: isApproving,
    setIsUpdating: setIsApproving,
    markStale,
  } = useMemberData(memberQuery);

  const [registrationFilter, setRegistrationFilter] = useState("pastMonth");
  const [selectedCrsids, setSelectedCrsids] = useState([]);
  const [matchingRows, setMatchingRows] = useState([]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  useEffect(() => {
    if (loadedAt) {
      setSelectedCrsids([]);
      setIsReviewOpen(false);
    }
  }, [loadedAt]);

  useEffect(() => {
    if (isStale && !isApproving) setIsReviewOpen(false);
  }, [isStale, isApproving]);

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

  const selectedMembers = data.filter(({ Crsid }) =>
    selectedCrsids.includes(Crsid),
  );
  const hiddenSelectedCount = selectedCrsids.filter(
    (id) => !matchingRows.some(({ Crsid }) => Crsid === id),
  ).length;

  const handleSelectMember = (Crsid, checked) => {
    setSelectedCrsids((selected) =>
      checked ? [...selected, Crsid] : selected.filter((id) => id !== Crsid),
    );
  };

  const handleCloseReview = () => {
    if (!isApproving) setIsReviewOpen(false);
  };

  const handleMarkSelectedPaid = async () => {
    if (
      isLoading ||
      isStale ||
      isApproving ||
      !isReviewOpen ||
      selectedCrsids.length === 0
    )
      return;

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
      setIsReviewOpen(false);
      if (failed.length > 0) markStale();
      setToastSetting({
        visible: true,
        content:
          failed.length > 0
            ? `Approved ${approved.length} of ${selectedCrsids.length} payments. ${failed.length} could not be confirmed; refreshing data.`
            : `Marked ${approved.length} ${approved.length === 1 ? "member" : "members"} as paid.`,
        severity: failed.length > 0 ? "error" : "success",
      });
    } catch {
      setIsReviewOpen(false);
      markStale();
      setToastSetting({
        visible: true,
        content:
          "Could not confirm payments. Refreshing data; review before retrying.",
        severity: "error",
      });
    } finally {
      setIsApproving(false);
    }
  };

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
            onClick={() => setIsReviewOpen(true)}
            disabled={
              isLoading || isStale || isApproving || selectedCrsids.length === 0
            }
            sx={{ alignSelf: "flex-start" }}
          >
            {isApproving
              ? "Approving..."
              : `Mark selected as paid (${selectedCrsids.length})`}
          </Button>
          {hiddenSelectedCount > 0 && (
            <Typography color="error" sx={{ alignSelf: "center" }}>
              {hiddenSelectedCount} hidden by search
            </Typography>
          )}
          <Button
            onClick={() => setSelectedCrsids([])}
            disabled={isApproving || selectedCrsids.length === 0}
            sx={{ alignSelf: "flex-start" }}
          >
            Clear selection
          </Button>
        </Stack>
        {loadedAt && (
          <Typography variant="body2" sx={{ my: 1 }}>
            {matchingRows.length} of {data.length} unpaid members
          </Typography>
        )}
        <DataTable
          onFilteredRowsChange={setMatchingRows}
          rows={filteredData}
          initialRowsPerPage={-1}
          selectedCrsids={selectedCrsids}
          onSelectRow={handleSelectMember}
          selectionDisabled={isLoading || isStale || isApproving}
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
          hasLoaded={Boolean(loadedAt)}
        />
      </div>
      <Dialog
        open={isReviewOpen}
        onClose={handleCloseReview}
        disableEscapeKeyDown={isApproving}
        aria-labelledby="payment-review-title"
        aria-describedby="payment-review-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="payment-review-title">
          Review payment approvals
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="payment-review-description">
            You are about to mark {selectedCrsids.length}{" "}
            {selectedCrsids.length === 1 ? "member" : "members"} as paid.
            Confirm that payment has been received. This action cannot be
            undone.
          </DialogContentText>
          <List dense aria-label="Members selected for payment approval">
            {selectedMembers.map(({ Crsid, FirstName, LastName }) => (
              <ListItem key={Crsid}>
                <ListItemText
                  primary={`${FirstName} ${LastName}`}
                  secondary={Crsid}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReview} disabled={isApproving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleMarkSelectedPaid}
            disabled={
              isLoading || isStale || isApproving || selectedCrsids.length === 0
            }
          >
            {isApproving ? "Approving..." : "Confirm and mark as paid"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

PaymentApproval.propTypes = {
  setToastSetting: PropTypes.func.isRequired,
};

export default PaymentApproval;
