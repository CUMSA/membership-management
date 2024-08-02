import React, { useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";

import scan from "../../dynamo/query";
import DataTable from "../DataTable";
import transform from "../../dynamo/transform";
import update from "../../dynamo/update";
import { byDate } from "../../utils/sortFuncs";
import CardIssueButtonGroup from "../CardIssueButtonGroup";
// import convertToCSV from "../utils/generateQpayCSV";

const CardIssueApproval = ({ isLoading, setIsLoading, setToastSetting }) => {
  const { user } = useAuthenticator((context) => [context.user]);

  const [data, setData] = useState([]);
  const [allCols, setAllCols] = useState([]);

  const handleSetQPayTrue = (newVal, Crsid) => {
    const token = user.getSignInUserSession().getIdToken().getJwtToken();
    console.log("toktoktok: " + token);
    if (newVal === true) {
      return update({ Crsid, Action: "ConfirmCardIssue" }, token)
        .then((r) => {
          setToastSetting({
            visible: true,
            content: `Successfully set CardIssued for ${Crsid} to true`,
            severity: "success",
          });
          setData(data.filter((d) => d.Crsid != Crsid));
        })
        .catch((e) => {
          setToastSetting({
            visible: true,
            content: "Failed to set CardIssued to true. Try again later.",
            severity: "error",
          });
        });
    }
  };

  useEffect(() => {
    const token = user.getSignInUserSession().getIdToken().getJwtToken();
    console.log(user, token);
    setIsLoading(true);
    scan(
      {
        ExpressionAttributeValues: {
          ":p": {
            BOOL: true,
          },
          ":c": {
            BOOL: false,
          },
        },
        FilterExpression: "Paid = :p and CardIssued = :c",
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
        <CardIssueButtonGroup
          data={data}
          setToastSetting={setToastSetting}
          setData={setData}
        />

        <DataTable
          handleToggle={handleSetQPayTrue}
          rows={data}
          allCols={allCols}
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
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default CardIssueApproval;
