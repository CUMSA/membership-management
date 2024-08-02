import React, { useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";

import scan from "../../dynamo/query";
import DataTable from "../DataTable";
import transform from "../../dynamo/transform";
import update from "../../dynamo/update";
import { byDate } from "../../utils/sortFuncs";

const PaymentApproval = ({ isLoading, setIsLoading, setToastSetting }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const [data, setData] = useState([]);
  const [allCols, setAllCols] = useState([]);

  const handleSetPayTrue = (newVal, Crsid) => {
    const token = user.getSignInUserSession().getIdToken().getJwtToken();
    console.log(token);

    if (newVal === true) {
      return update({ Crsid, Action: "ConfirmPayment" }, token)
        .then((r) => {
          setToastSetting({
            visible: true,
            content: `Successfully set Paid for ${Crsid} to true`,
            severity: "success",
          });
          setData(data.filter((d) => d.Crsid != Crsid));
        })
        .catch((e) => {
          setToastSetting({
            visible: true,
            content: "Failed to set Paid to true. Try again later.",
            severity: "error",
          });
        });
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
      token
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
        <DataTable
          handleToggle={handleSetPayTrue}
          rows={data}
          allCols={allCols}
          filterCols={[
            "Paid",
            "Crsid",
            "MembershipType",
            "FirstName",
            "LastName",
            "RegistrationTime",
          ]}
          sortF={byDate(1)}
          searchCol={"Crsid"}
          toggleCols={["Paid"]}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default PaymentApproval;
