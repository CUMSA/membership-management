import cumsaBanner from "./assets/cumsa-logo-2.png";
import { useTheme } from "@aws-amplify/ui-react";

const components = {
  SignIn: {
    Header() {
      const { tokens } = useTheme();
      return (
        <div
          style={{
            margin: `0 ${tokens.space.xl} 0 ${tokens.space.xl}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={cumsaBanner}
            alt="cumsa banner"
            style={{
              borderBottom: "1px solid gray",
              width: "300px",
              maxHeight: "100px",
              objectFit: "contain",
            }}
          />
          <div>
            <h1 style={{ textAlign: "left" }}>Sign In</h1>
            <p>
              Comm members who would like access, email the database officer.
            </p>
          </div>
        </div>
      );
    },
  },
};

export default components;
