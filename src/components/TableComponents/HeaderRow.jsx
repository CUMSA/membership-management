import React from "react";
import TableCell from "@mui/material/TableCell";

import TableRow from "@mui/material/TableRow";
import { Input } from "@mui/material";
import CollegeDropDown from "./CollegeDropDown";
import CourseDropDown from "./CourseDropDown";

const HeaderRow = ({
  toggleCols,
  colNameMap,
  filterCols,
  search,
  setSearch,
  searchCol,
}) => {
  return (
    <TableRow>
      {toggleCols &&
        toggleCols.map((c) => <TableCell>{colNameMap[c] || c}</TableCell>)}
      {filterCols
        .filter((x) => !toggleCols || !toggleCols.includes(x))
        .map((c) => {
          let toRet = (
            <Input
              type="text"
              value={search[c]}
              onChange={(v) => {
                setSearch({ ...search, [c]: v.target.value });
              }}
              placeholder="Search"
              inputProps={{
                style: {
                  fontSize: "13px",
                },
              }}
            />
          );
          if (c == "College") {
            toRet = <CollegeDropDown setSearch={setSearch} search={search} />;
          } else if (c == "Course") {
            toRet = <CourseDropDown setSearch={setSearch} search={search} />;
          }
          return (
            <TableCell>
              {colNameMap[c] || c} <br />
              {searchCol.includes(c) && toRet}
            </TableCell>
          );
        })}
    </TableRow>
  );
};

export default HeaderRow;
