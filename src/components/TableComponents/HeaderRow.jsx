import PropTypes from "prop-types";
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
        toggleCols.map((c) => (
          <TableCell key={c}>{colNameMap[c] || c}</TableCell>
        ))}
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
            <TableCell key={c}>
              {colNameMap[c] || c} <br />
              {searchCol.includes(c) && toRet}
            </TableCell>
          );
        })}
    </TableRow>
  );
};

HeaderRow.propTypes = {
  toggleCols: PropTypes.array,
  colNameMap: PropTypes.object.isRequired,
  filterCols: PropTypes.array.isRequired,
  search: PropTypes.object.isRequired,
  setSearch: PropTypes.func.isRequired,
  searchCol: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
    .isRequired,
};

export default HeaderRow;
