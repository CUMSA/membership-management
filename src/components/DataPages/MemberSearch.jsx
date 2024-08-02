import React, { useEffect, useState } from "react";

import scan from "../../dynamo/query";
import DataTable from "../DataTable";
import transform from "../../dynamo/transform";
import { byDate } from "../../utils/sortFuncs";
import MemberSearchActionGroup from "../MemberSearchActionGroup";
import { useAuthenticator } from "@aws-amplify/ui-react";

const MemberSearch = ({ isLoading, setIsLoading, setToastSetting }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const [data, setData] = useState([]);
  const [allCols, setAllCols] = useState([]);
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
  ]

  useEffect(() => {
    const token = user.getSignInUserSession().getIdToken().getJwtToken();
    setIsLoading(true);
    scan({}, token)
      .then((r) => {
        setIsLoading(false);
        setData(transform(r));
        setAllCols(
          Object.keys(r[0]).map((k) => ({
            field: k,
            headerName: k,
            width: 150,
          }))
        );
      })
      .catch((e) => {
        setIsLoading(false);
        setToastSetting({
          visible: true,
          content: "Failed to fetch data. Try again later.",
          severity: "error",
        });
      });
  }, []);

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
        handleToggle={() => { }}
        rows={data}
        isLoading={isLoading}
        filterCols={columns}
        sortF={byDate(1)}
        searchCol={["Crsid", "FirstName", "LastName", "Course", "College", "Scholarship", "Nationality"]}
        memberFilter={memberFilter}
        validOnly={validOnly}
        memberBadge={true}
      />
    </div>
  );
};

export default MemberSearch;
