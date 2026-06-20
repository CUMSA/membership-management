import { useState } from "react";

import useMemberData from "../../hooks/useMemberData";
import DataTable from "../DataTable";
import { byDate } from "../../utils/sortFuncs";
import MemberSearchActionGroup from "../MemberSearchActionGroup";

const memberQuery = {};

const MemberSearch = () => {
  const { data, isLoading, loadedAt } = useMemberData(memberQuery);

  const [memberFilter, setMemberFilter] = useState("all");
  const [validOnly, setValidOnly] = useState(true);

  const columns = [
    "Crsid",
    "FirstName",
    "LastName",
    "College",
    "Course",
    "AltEmail",
    "MatriculationYear",
    "GraduationYear",
    "Scholarship",
    "Nationality",
    "MembershipType",
    "RegistrationTime",
    "Paid",
    "CardIssued",
    "Expired",
  ];

  return (
    <div className="table-wrap">
      <MemberSearchActionGroup
        memberFilter={memberFilter}
        validOnly={validOnly}
        setMemberFilter={setMemberFilter}
        setValidOnly={setValidOnly}
        data={data}
      />
      <DataTable
        handleToggle={() => {}}
        rows={data}
        isLoading={isLoading}
        hasLoaded={Boolean(loadedAt)}
        filterCols={columns}
        sortF={byDate(1)}
        searchCol={[
          "Crsid",
          "FirstName",
          "LastName",
          "Course",
          "College",
          "Scholarship",
          "Nationality",
        ]}
        memberFilter={memberFilter}
        validOnly={validOnly}
        memberBadge={true}
      />
    </div>
  );
};

export default MemberSearch;
