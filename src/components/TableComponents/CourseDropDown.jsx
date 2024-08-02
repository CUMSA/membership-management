import React, { useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import coursemap from "./coursemapping.json";

export default function CourseDropDown({ search, setSearch }) {
  return (
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={search.Course}
      label="Age"
      onChange={(v) => {
        setSearch({ ...search, Course: v.target.value });
      }}
      variant="standard"
      fullWidth
    >
      {Object.keys(coursemap).map((k) => (
        <MenuItem value={coursemap[k]}>{coursemap[k]}</MenuItem>
      ))}
      <MenuItem value="">None</MenuItem>
    </Select>
  );
}
