import React, { useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function MemberAgeDropDown({ memberFilter, setMemberFilter }) {
  return (
    <Select
      value={memberFilter}
      label="Age"
      onChange={(v) => {
        setMemberFilter(v.target.value);
      }}
      variant="standard"
      style={{
        marginBottom: "10px",
        minWidth: "200px",
      }}
    >
      <MenuItem value="all">All Members</MenuItem>
      <MenuItem value="current">Current Students Only</MenuItem>
      <MenuItem value="alumni">Alumni Only</MenuItem>
    </Select>
  );
}
