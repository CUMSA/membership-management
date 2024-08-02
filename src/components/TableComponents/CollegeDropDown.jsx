import React, { useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function CollegeDropDown({ search, setSearch }) {
  return (
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={search.College}
      label="Age"
      onChange={(v) => {
        setSearch({ ...search, College: v.target.value });
      }}
      variant="standard"
      fullWidth
    >
      <MenuItem value="">Choose</MenuItem>
      <MenuItem value="Christ's College">Christ’s College</MenuItem>
      <MenuItem value="Churchill College">Churchill College</MenuItem>
      <MenuItem value="Clare College">Clare College</MenuItem>
      <MenuItem value="Clare Hall">Clare Hall</MenuItem>
      <MenuItem value="Corpus Christi College">Corpus Christi College</MenuItem>
      <MenuItem value="Darwin College">Darwin College</MenuItem>
      <MenuItem value="Downing College">Downing College</MenuItem>
      <MenuItem value="Emmanuel College">Emmanuel College</MenuItem>
      <MenuItem value="Fitzwilliam College">Fitzwilliam College</MenuItem>
      <MenuItem value="Girton College">Girton College</MenuItem>
      <MenuItem value="Gonville and Caius College">
        Gonville and Caius College
      </MenuItem>
      <MenuItem value="Homerton College">Homerton College</MenuItem>
      <MenuItem value="Hughes Hall">Hughes Hall</MenuItem>
      <MenuItem value="Jesus College">Jesus College</MenuItem>
      <MenuItem value="King's College">King’s College</MenuItem>
      <MenuItem value="Lucy Cavendish College">Lucy Cavendish College</MenuItem>
      <MenuItem value="Magdalene College">Magdalene College</MenuItem>
      <MenuItem value="Murray Edwards College">Murray Edwards College</MenuItem>
      <MenuItem value="Newnham College">Newnham College</MenuItem>
      <MenuItem value="Pembroke College">Pembroke College</MenuItem>
      <MenuItem value="Peterhouse">Peterhouse</MenuItem>
      <MenuItem value="Queens' College">Queens’ College</MenuItem>
      <MenuItem value="Robinson College">Robinson College</MenuItem>
      <MenuItem value="Selwyn College">Selwyn College</MenuItem>
      <MenuItem value="Sidney Sussex College">Sidney Sussex College</MenuItem>
      <MenuItem value="St Catharine's College">St Catharine’s College</MenuItem>
      <MenuItem value="St Edmund's College">St Edmund’s College</MenuItem>
      <MenuItem value="St John's College">St John’s College</MenuItem>
      <MenuItem value="Trinity College">Trinity College</MenuItem>
      <MenuItem value="Trinity Hall">Trinity Hall</MenuItem>
      <MenuItem value="Wolfson College">Wolfson College</MenuItem>
      <MenuItem value="None">None</MenuItem>
    </Select>
  );
}
