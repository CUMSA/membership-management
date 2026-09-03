import PropTypes from "prop-types";
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
        <MenuItem key={k} value={coursemap[k]}>
          {coursemap[k]}
        </MenuItem>
      ))}
      <MenuItem value="">None</MenuItem>
    </Select>
  );
}

CourseDropDown.propTypes = {
  search: PropTypes.shape({ Course: PropTypes.string }).isRequired,
  setSearch: PropTypes.func.isRequired,
};
