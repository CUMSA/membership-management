import PropTypes from "prop-types";
import { CSVLink } from "react-csv";
import { useAuthenticator } from "@aws-amplify/ui-react";

import update from "../dynamo/update";
import { emailAddCamDomain } from "../utils/formatEmail";
import formatPhoneNumber from "../utils/formatPhone";

const CardIssueButtonGroup = ({
  data,
  setToastSetting,
  setData,
  disabled = false,
  setIsUpdating,
  onUpdateError,
}) => {
  const { user } = useAuthenticator((context) => [context.user]);

  let currMembershipCycle = new Date().getFullYear();
  const month = new Date().getMonth();
  if (month < 8) {
    currMembershipCycle -= 1;
  }

  const handleMarkAll = async () => {
    if (
      disabled ||
      !window.confirm(
        "You are about to mark ALL of entries as issued. This is a dangerous operation that cannot be undone. Are you sure you want to continue?",
      )
    )
      return;
    setIsUpdating(true);
    try {
      const token = user.getSignInUserSession().getIdToken().getJwtToken();
      const results = await Promise.allSettled(
        data.map(({ Crsid }) =>
          update({ Action: "ConfirmCardIssue", Crsid }, token),
        ),
      );
      if (results.some(({ status }) => status === "rejected"))
        throw new Error("Update failed");
      setToastSetting({
        visible: true,
        content: "Successfully set CardIssued for all users to True",
        severity: "success",
      });
      setData([]);
    } catch {
      onUpdateError();
      setToastSetting({
        visible: true,
        content:
          "Could not confirm card issues. Refreshing data; review before retrying.",
        severity: "error",
      });
    } finally {
      setIsUpdating(false);
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
              "Phone Number": formatPhoneNumber(d.UKMobile),
              Email: emailAddCamDomain(d.Crsid),
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
                `1 year (${currMembershipCycle}-${currMembershipCycle + 1})`,
            )
            .map((d) => ({
              Name: d.FirstName + " " + d.LastName,
              "Phone Number": formatPhoneNumber(d.UKMobile),
              Email: emailAddCamDomain(d.Crsid),
            }))}
          filename={`1 year (${currMembershipCycle}-${
            currMembershipCycle + 1
          })-members.csv`}
        >
          <button className="qpayDownloadBtn">Download CSV (1 year)</button>
        </CSVLink>
      </div>
      <button className="markAll" onClick={handleMarkAll} disabled={disabled}>
        Mark all as issued
      </button>
    </div>
  );
};

CardIssueButtonGroup.propTypes = {
  data: PropTypes.array.isRequired,
  setToastSetting: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  setIsUpdating: PropTypes.func.isRequired,
  onUpdateError: PropTypes.func.isRequired,
};

export default CardIssueButtonGroup;
