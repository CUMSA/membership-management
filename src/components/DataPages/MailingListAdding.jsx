import React, { useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";

import scan from "../../dynamo/query";
import DataTable from "../DataTable";
import transform from "../../dynamo/transform";
import update from "../../dynamo/update";
import { byDate } from "../../utils/sortFuncs";
import MailingListButtonGroup from "../MailingListButtonGroup";

const MailingListAdding = ({ isLoading, setIsLoading, setToastSetting }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const [data, setData] = useState([]);
  const [allCols, setAllCols] = useState([]);

  useEffect(() => {
    const token = user.getSignInUserSession().getIdToken().getJwtToken();
    setIsLoading(true);
    scan(
      {
        ExpressionAttributeValues: {
          ":p": {
            BOOL: true,
          },
          ":c": {
            BOOL: true,
          },
          ":m": {
            BOOL: false,
          },
        },
        FilterExpression:
          "Paid = :p and CardIssued = :c and InMailingList = :m",
      },
      token
    )
      .then((r) => {
        setIsLoading(false);
        setData(transform(r));
        if (r.length > 0) {
          setAllCols(
            Object.keys(r[0]).map((k) => ({
              field: k,
              headerName: k,
              width: 150,
            }))
          );
        }
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
    <>
      <div className="table-wrap">
        <MailingListButtonGroup
          data={data}
          setToastSetting={setToastSetting}
          setData={setData}
        />

        <DataTable
          rows={data}
          allCols={allCols}
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
          memberBadge
        />
      </div>
    </>
  );
};

export default MailingListAdding;
