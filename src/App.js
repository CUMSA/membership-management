import React, { useState, useEffect } from "react";

import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import "@aws-amplify/ui-react/styles.css";

import "./App.css";
import awsExports from "./aws-exports";

// Pages
import PaymentApproval from "./components/DataPages/PaymentApproval";
import CardIssueApproval from "./components/DataPages/CardIssueApproval";
import MemberSearch from "./components/DataPages/MemberSearch";
import MailingListAdding from "./components/DataPages/MailingListAdding";

import PageNavigator from "./components/PageNavigator";
import components from "./cognito-components";

Amplify.configure({
  Auth: {
    region: awsExports.REGION,
    userPoolId: awsExports.USER_POOL_ID,
    userPoolWebClientId: awsExports.USER_POOL_APP_CLIENT_ID,
  },
});

const pageMap = [
  {
    name: "Payment Approval",
    component: (props) => <PaymentApproval {...props} />,
    subtitle:
      "This page shows people who have not been marked as paid in the database.",
  },
  {
    name: "Card Issue Approval",
    component: (props) => <CardIssueApproval {...props} />,
    subtitle:
      "This page shows the people who have paid, but have not received QPay membership. The downloaded CSVs can be used to import members into QPay.",
  },
  {
    name: "Member Search",
    component: (props) => <MemberSearch {...props} />,
    subtitle:
      "This page shows the people who are currently registered members. i.e. Have paid and have had cards issued.",
  },
  {
    name: "Mailing List Management",
    component: (props) => <MailingListAdding {...props} />,
    subtitle:
      "This page shows the people who are currently not on the mailing list but are members (have paid, had their cards issued, not expired).",
  },
];

function App() {
  const [toastSetting, setToastSetting] = useState({
    visible: false,
    content: "",
    severity: "success",
  });

  const [page, setPage] = useState(0);

  const [pageMenuVisible, setPageMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const open = Boolean(pageMenuVisible);
  const handleClick = (event) => {
    setPageMenuVisible(event.currentTarget);
  };
  const handleClose = () => {
    setPageMenuVisible(null);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} {...props} />;
  });

  return (
    <div className="container">
      <Authenticator
        className="signin-container"
        hideSignUp={true}
        components={components}
      >
        {({ signOut, user }) => (
          <>
            <div className="content-container">
              <Snackbar
                open={toastSetting.visible}
                autoHideDuration={6000}
                onClose={() => {
                  setToastSetting({ ...toastSetting, visible: false });
                }}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert
                  onClose={() => {
                    setToastSetting({ ...toastSetting, visible: false });
                  }}
                  severity={toastSetting.severity}
                  sx={{ width: "100%" }}
                >
                  {toastSetting.content}
                </Alert>
              </Snackbar>

              <PageNavigator
                open={open}
                handleClick={handleClick}
                page={page}
                signOut={signOut}
                pageMenuVisible={pageMenuVisible}
                handleClose={handleClose}
                setPage={setPage}
                pageMap={pageMap}
              />

              <p style={{ margin: "0 0 20px 0", padding: 0 }}>
                {pageMap[page].subtitle}
              </p>
              {pageMap[page].component({
                isLoading,
                setIsLoading,
                setToastSetting,
              })}
            </div>
          </>
        )}
      </Authenticator>
    </div>
  );
}

export default App;
