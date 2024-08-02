import React from "react";
import { CSVLink } from "react-csv";
import { useAuthenticator } from "@aws-amplify/ui-react";

import update from "../dynamo/update";

const CardIssueButtonGroup = ({ data, setToastSetting, setData }) => {
  const { user } = useAuthenticator((context) => [context.user]);

  let currMembershipCycle = new Date().getFullYear();
  const month = new Date().getMonth();
  if (month < 8) {
    currMembershipCycle -= 1;
  }

  const handleMarkAll = () => {
    if (
      window.confirm(
        "You are about to mark ALL of entries as issued. This is a dangerous operation that cannot be undone. Are you sure you want to continue?"
      )
    ) {
      const token = user.getSignInUserSession().getIdToken().getJwtToken();
      console.log(user, token);

      return Promise.all(
        data.map((d) => {
          console.log(d);
          return update(
            {
              Action: "ConfirmCardIssue",
              Crsid: d.Crsid,
            },
            token
          );
        })
      )
        .then((r) => {
          setToastSetting({
            visible: true,
            content: `Successfully set CardIssued for all users to True`,
            severity: "success",
          });
          setData([]);
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
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
      }}
    >
      <div>
        <CSVLink
          data={data
            .filter((d) => d.MembershipType == "Life")
            .map((d) => ({
              Name: d.FirstName + " " + d.LastName,
              "Phone Number": d.UKMobile,
              Email: d.Crsid,
            }))}
          filename={"Life-members.csv"}
        >
          <button className="qpayDownloadBtn">Download CSV (Life)</button>
        </CSVLink>
        <CSVLink
          data={data
            .filter(
              (d) =>
                d.MembershipType ==
                `1 year (${currMembershipCycle}-${currMembershipCycle + 1})`
            )
            .map((d) => ({
              Name: d.FirstName + " " + d.LastName,
              "Phone Number": d.UKMobile,
              Email: `${d.Crsid}@cam.ac.uk`,
            }))}
          filename={`1 year (${currMembershipCycle}-${
            currMembershipCycle + 1
          })-members.csv`}
        >
          <button className="qpayDownloadBtn">Download CSV (1 year)</button>
        </CSVLink>
      </div>
      <button className="markAll" onClick={handleMarkAll}>
        Mark all as issued
      </button>
    </div>
  );
};

export default CardIssueButtonGroup;
