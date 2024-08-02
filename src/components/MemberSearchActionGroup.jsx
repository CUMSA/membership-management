import React, { useState } from "react";
import MemberAgeDropDown from "./MemberAgeDropDown";

import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { CSVLink } from "react-csv";
import CloseIcon from "@mui/icons-material/Close";
import { FormGroup, FormControlLabel, Switch } from "@mui/material";

const MemberSearchActionGroup = ({ memberFilter, validOnly, setMemberFilter, setValidOnly, data }) => {
  const [open, setOpen] = useState(false);
  const [crsids, setCrsids] = useState("");
  const [crsidData, setCrsidData] = useState([{}]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleCheck = (event, done) => {
    const crsidArr = crsids.split("\n").map((c) => {
      if (c.includes("@cam.ac.uk")) {
        return c.split("@")[0];
      } else {
        return c;
      }
    });

    const crsidDataProc = crsidArr.map((c) => {
      const entry = data.filter(
        (d) => d.Crsid.toLowerCase() == c.toLowerCase()
      );
      if (entry.length > 0) {
        const { Paid, Expired, CardIssued } = entry[0];
        console.log(entry, Paid, Expired, CardIssued);
        return {
          Crsid: c,
          InDatabase: true,
          ValidMember: Paid && !Expired,
          Paid,
          CardIssued,
          Expired,
        };
      } else {
        return {
          Crsid: c,
          InDatabase: false,
          ValidMember: false,
          Paid: false,
          CardIssued: false,
          Expired: false,
        };
      }
    });

    setCrsidData(crsidDataProc);
    done(true);
  };

  return (
    <div className="member-action">
      <MemberAgeDropDown
        memberFilter={memberFilter}
        setMemberFilter={setMemberFilter}
      />

      <FormGroup>
        <FormControlLabel 
          control={<Switch defaultChecked />} 
          label="Show Valid Members Only" 
          onChange={(e) => {
            setValidOnly(e.target.checked);
          }}
        />
      </FormGroup>

      <button onClick={handleOpen}>Batch Search</button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div class="modal">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Put in Crsids to check
          </Typography>
          <textarea
            className="CrsidInput"
            cols="40"
            rows="5"
            placeholder={`xyz123@cam.ac.uk \nxyz234@cam.ac.uk \nxyz345@cam.ac.uk \n\n-- or --\n\nxyz123\nxyz234\nxyz345`}
            onChange={(x) => {
              setCrsids(x.target.value);
            }}
            value={crsids}
          ></textarea>

          <CSVLink
            data={crsidData}
            onClick={handleCheck}
            asyncOnClick={true}
            filename="Crsid-member-check.csv"
            separator={`\t`}
          >
            <button className="csvDownloadBtn">Check</button>
          </CSVLink>

          <button
            style={{
              border: "none",
              position: "absolute",
              right: "0px",
              top: "5px",
            }}
            onClick={handleClose}
          >
            <CloseIcon />
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default MemberSearchActionGroup;
