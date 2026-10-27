import PropTypes from "prop-types";

import useMemberData from "../../hooks/useMemberData";
import DataTable from "../DataTable";
import { byDate } from "../../utils/sortFuncs";
import MailingListButtonGroup from "../MailingListButtonGroup";

const memberQuery = {
  ExpressionAttributeValues: {
    ":p": { BOOL: true },
    ":c": { BOOL: true },
    ":m": { BOOL: false },
  },
  FilterExpression: "Paid = :p and CardIssued = :c and InMailingList = :m",
};

const MailingListAdding = ({ setToastSetting }) => {
  const {
    data,
    setData,
    isLoading,
    loadedAt,
    isStale,
    isUpdating,
    setIsUpdating,
    markStale,
  } = useMemberData(memberQuery);

  return (
    <>
      <div className="table-wrap">
        <MailingListButtonGroup
          data={data}
          setToastSetting={setToastSetting}
          setData={setData}
          disabled={isLoading || isStale || isUpdating}
          setIsUpdating={setIsUpdating}
          onUpdateError={markStale}
        />

        <DataTable
          rows={data}
          filterCols={[
            "Crsid",
            "FirstName",
            "LastName",
            "InMailingList",
            "RegistrationTime",
          ]}
          searchCol={"Crsid"}
          sortF={byDate(1)}
          toggleCols={[]}
          isLoading={isLoading}
          hasLoaded={Boolean(loadedAt)}
          memberBadge
        />
      </div>
    </>
  );
};

MailingListAdding.propTypes = {
  setToastSetting: PropTypes.func.isRequired,
};

export default MailingListAdding;
