import React from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";

import update from "../dynamo/update";

const MailingListButtonGroup = ({ data, setToastSetting, setData }) => {
  const { user } = useAuthenticator((context) => [context.user]);

  const nameUpper = (name) => {
    return name
      .split(" ")
      .map((e) => `${e.charAt(0).toUpperCase()}${e.slice(1).toLowerCase()}`)
      .join(" ");
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const text = data
      .map(
        (d) =>
          `${d.Crsid}@cam.ac.uk ${nameUpper(d.FirstName)} ${nameUpper(
            d.LastName
          )}`
      )
      .join("\n");

    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "to-add-to-mail-list.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const handleMarkAll = () => {
    const token = user.getSignInUserSession().getIdToken().getJwtToken();
    if (
      window.confirm(
        "You are about to mark ALL entries as in the mailing list. This is a dangerous operation that cannot be undone. Are you sure you want to continue?"
      )
    ) {
      return Promise.all(
        data.map((d) => {
          console.log(d);
          return update(
            {
              Action: "AddToMailingList",
              Crsid: d.Crsid,
            },
            token
          );
        })
      )
        .then((r) => {
          setToastSetting({
            visible: true,
            content: `Successfully set InMailingList for all users to True`,
            severity: "success",
          });
          setData([]);
        })
        .catch((e) => {
          setToastSetting({
            visible: true,
            content: "Failed to set InMailingList to true. Try again later.",
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
        <button className="qpayDownloadBtn" onClick={handleDownload}>
          Download .txt
        </button>
      </div>
      <button className="markAll" onClick={handleMarkAll}>
        Mark all as in mail list
      </button>
    </div>
  );
};

export default MailingListButtonGroup;
