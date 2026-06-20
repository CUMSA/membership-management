import PropTypes from "prop-types";

import useMemberData from "../../hooks/useMemberData";
import DataTable from "../DataTable";
import update from "../../dynamo/update";
import { byDate } from "../../utils/sortFuncs";
import CardIssueButtonGroup from "../CardIssueButtonGroup";
// import convertToCSV from "../utils/generateQpayCSV";

const memberQuery = {
  ExpressionAttributeValues: { ":p": { BOOL: true }, ":c": { BOOL: false } },
  FilterExpression: "Paid = :p and CardIssued = :c",
};

const CardIssueApproval = ({ setToastSetting }) => {
  const {
    data,
    setData,
    isLoading,
    loadedAt,
    isStale,
    isUpdating,
    setIsUpdating,
    markStale,
    user,
  } = useMemberData(memberQuery);

  const handleSetQPayTrue = async (newVal, Crsid) => {
    if (newVal !== true || isLoading || isStale || isUpdating) return;
    setIsUpdating(true);
    try {
      const token = user.getSignInUserSession().getIdToken().getJwtToken();
      await update({ Crsid, Action: "ConfirmCardIssue" }, token);
      setToastSetting({
        visible: true,
        content: `Successfully set CardIssued for ${Crsid} to true`,
        severity: "success",
      });
      setData((current) => current.filter((d) => d.Crsid !== Crsid));
    } catch {
      markStale();
      setToastSetting({
        visible: true,
        content:
          "Could not confirm card issue. Refreshing data; review before retrying.",
        severity: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="table-wrap">
        <CardIssueButtonGroup
          data={data}
          setToastSetting={setToastSetting}
          setData={setData}
          disabled={isLoading || isStale || isUpdating}
          setIsUpdating={setIsUpdating}
          onUpdateError={markStale}
        />

        <DataTable
          handleToggle={handleSetQPayTrue}
          rows={data}
          filterCols={[
            "CardIssued",
            "Crsid",
            "MembershipType",
            "FirstName",
            "LastName",
            "RegistrationTime",
          ]}
          searchCol={"Crsid"}
          sortF={byDate(1)}
          toggleCols={["CardIssued"]}
          toggleDisabled={isLoading || isStale || isUpdating}
          isLoading={isLoading}
          hasLoaded={Boolean(loadedAt)}
        />
      </div>
    </>
  );
};

CardIssueApproval.propTypes = {
  setToastSetting: PropTypes.func.isRequired,
};

export default CardIssueApproval;
