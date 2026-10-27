import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import Checkbox from "@mui/material/Checkbox";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import HeaderRow from "./TableComponents/HeaderRow";
import ToggleDropdown from "./TableComponents/ToggleDropdown";
import { emailRemoveCamDomain } from "../utils/formatEmail";

import loadingGif from "../assets/loading-gif.gif";
import { Typography } from "@mui/material";

export default function DataTable({
  rows,
  filterCols,
  toggleCols,
  handleToggle,
  toggleDisabled = false,
  searchCol,
  sortF,
  isLoading,
  hasLoaded = true,
  memberFilter = "all",
  memberBadge = false,
  validOnly = false,
  onFilteredRowsChange,
  selectedCrsids = [],
  onSelectRow,
  selectionDisabled = false,
  initialRowsPerPage = 5,
}) {
  const colNameMap = {
    Crsid: "Crsid",
    FirstName: "First Name",
    LastName: "Last Name",
    RegistrationTime: "Reg. Time",
    MatriculationYear: "Matric. Year",
    GraduationYear: "Grad. Year",
    MembershipType: "Member Type",
    CardIssued: "Card Issued",
  };

  const [search, setSearch] = useState({
    Crsid: "",
    College: "",
    FirstName: "",
    LastName: "",
    Course: "",
    Members: "all",
    Scholarship: "",
    Nationality: "",
  });
  const [dispData, setDispData] = useState([false, false]);
  const [isFiltering, setIsFiltering] = useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const [selectedAttribute, setSelectedAttribute] = useState("MembershipType");
  const [countsByAttribute, setCountsByAttribute] = useState({}); // { attribute: count }
  // const [tableData, setTableData] = useState([]);

  const currentPage =
    rowsPerPage === -1
      ? 0
      : Math.min(
          page,
          Math.max(0, Math.ceil(dispData.length / rowsPerPage) - 1),
        );

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    currentPage > 0
      ? Math.max(0, (1 + currentPage) * rowsPerPage - dispData.length)
      : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    setPage(0);
  }, [rows, search, memberFilter, validOnly]);

  useEffect(() => {
    const f = async () => {
      setIsFiltering(true);
      const d = rows
        .filter(
          (d) =>
            !search.Crsid ||
            emailRemoveCamDomain(d.Crsid)
              .toLowerCase()
              .includes(emailRemoveCamDomain(search.Crsid).toLowerCase()),
        )
        .filter((d) => !search.College || d.College === search.College)
        .filter(
          (d) =>
            !search.FirstName ||
            d.FirstName.toLowerCase().includes(search.FirstName.toLowerCase()),
        )
        .filter(
          (d) =>
            !search.LastName ||
            d.LastName.toLowerCase().includes(search.LastName.toLowerCase()),
        )
        .filter(
          (d) =>
            !search.Course ||
            d.Course.toLowerCase().startsWith(search.Course.toLowerCase()),
        )
        .filter((d) => {
          if (memberFilter == "all") {
            return true;
          } else if (memberFilter == "current") {
            return (
              d.GraduationYear > new Date().getFullYear() ||
              (d.GraduationYear == new Date().getFullYear() &&
                new Date().getMonth() < 9)
            );
          } else {
            return (
              d.GraduationYear < new Date().getFullYear() ||
              (d.GraduationYear == new Date().getFullYear() &&
                new Date().getMonth() >= 9)
            );
          }
        })
        .filter(
          (d) =>
            !search.Scholarship ||
            d.Scholarship.toLowerCase().includes(
              search.Scholarship.toLowerCase(),
            ),
        )
        .filter(
          (d) =>
            !search.Nationality ||
            d.Nationality.toLowerCase().includes(
              search.Nationality.toLowerCase(),
            ),
        )
        .filter(
          (data) =>
            !validOnly || (data.Paid && data.CardIssued && !data.Expired),
        ) // Filter valid members
        .sort(sortF);
      setDispData(d);
      onFilteredRowsChange?.(d);

      // get counts, similar to GROUP BY construct in SQL
      const counts = {};
      d.forEach((data) => {
        const attr = data[selectedAttribute];
        if (!counts[attr]) {
          counts[attr] = 1;
        } else {
          counts[attr]++;
        }
      });

      setCountsByAttribute(counts);
    };
    f();
  }, [
    rows,
    sortF,
    search,
    memberFilter,
    validOnly,
    selectedAttribute,
    onFilteredRowsChange,
  ]);

  useEffect(() => {
    setIsFiltering(false);
  }, [dispData]);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2>Breakdown By Attribute</h2>
        <Select
          onChange={(e) => {
            setSelectedAttribute(e.target.value);
          }}
          placeholder="Select an attribute"
          value={selectedAttribute}
        >
          <MenuItem value="" aria-label="No breakdown">
            &nbsp;
          </MenuItem>
          {filterCols
            .filter((col) => col !== "Crsid")
            .map((col) => (
              <MenuItem key={col} value={col}>
                {col}
              </MenuItem>
            ))}
        </Select>

        {selectedAttribute && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{selectedAttribute}</TableCell>
                <TableCell>Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                // sort by descending counts
                Object.keys(countsByAttribute)
                  .sort((a, b) => countsByAttribute[b] - countsByAttribute[a])
                  .map((attr) => (
                    <TableRow key={attr}>
                      <TableCell>{attr}</TableCell>
                      <TableCell>{countsByAttribute[attr]}</TableCell>
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        )}
      </div>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 500 }}
          aria-label="custom pagination table"
          stickyHeader
        >
          <TableBody>
            <HeaderRow
              toggleCols={toggleCols}
              colNameMap={colNameMap}
              filterCols={filterCols}
              search={search}
              setSearch={setSearch}
              searchCol={searchCol}
              selectionEnabled={Boolean(onSelectRow)}
            />

            {/* Data */}
            {!isFiltering &&
              dispData
                .slice(
                  rowsPerPage === -1 ? 0 : currentPage * rowsPerPage,
                  rowsPerPage === -1
                    ? undefined
                    : (currentPage + 1) * rowsPerPage,
                )
                .map((data) => {
                  let badgeCard;

                  if (!data.Paid)
                    badgeCard = <div className="badge paid">Not Paid</div>;
                  else if (!data.CardIssued && data.Paid)
                    badgeCard = (
                      <div className="badge card">Card Not Issued</div>
                    );
                  else if (data.Expired)
                    badgeCard = <div className="badge expire">Expired</div>;
                  else if (data.Paid && data.CardIssued && !data.Expired)
                    badgeCard = <div className="badge valid">Valid</div>;

                  return (
                    <>
                      {memberBadge && (
                        <div className="badgeContainer">{badgeCard}</div>
                      )}

                      <TableRow
                        key={data.Crsid}
                        selected={selectedCrsids.includes(data.Crsid)}
                      >
                        {onSelectRow && (
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedCrsids.includes(data.Crsid)}
                              onChange={(event) =>
                                onSelectRow(data.Crsid, event.target.checked)
                              }
                              disabled={selectionDisabled}
                              inputProps={{
                                "aria-label": `Select ${data.Crsid}`,
                              }}
                            />
                          </TableCell>
                        )}
                        {/* Toggle */}
                        {toggleCols &&
                          toggleCols.map((c) => (
                            <TableCell key={c}>
                              <ToggleDropdown
                                currVal={data[c]}
                                attr={c}
                                Crsid={data.Crsid}
                                handleToggle={handleToggle}
                                disabled={toggleDisabled}
                              />
                            </TableCell>
                          ))}

                        {/* Columns to see */}
                        {filterCols
                          .filter((x) => !toggleCols || !toggleCols.includes(x))
                          .map((c) => (
                            <TableCell key={c}>{`${data[c]}`}</TableCell>
                          ))}
                      </TableRow>
                    </>
                  );
                })}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell
                  colSpan={filterCols.length + (onSelectRow ? 1 : 0)}
                />
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Loading */}
        {(isFiltering || isLoading) && (
          <div
            style={{
              width: "100%",
              padding: "10px 10px 10px 0px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              style={{
                width: 30,
                marginRight: "10px",
              }}
              src={loadingGif}
              alt="loading..."
            />
            <Typography>loading...</Typography>
          </div>
        )}
        {/* Empty */}
        {!isFiltering && !isLoading && dispData.length == 0 && (
          <div
            style={{
              width: "100%",
              padding: "10px 10px 10px 0px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography>
              {hasLoaded
                ? "No records to show"
                : "Data unavailable. Refresh to try again."}
            </Typography>
          </div>
        )}
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[
          5,
          10,
          30,
          50,
          100,
          200,
          { label: "All", value: -1 },
        ]}
        count={dispData.length}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        SelectProps={{
          inputProps: {
            "aria-label": "rows per page",
          },
          native: true,
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        component="div"
      />
    </div>
  );
}

DataTable.propTypes = {
  rows: PropTypes.array.isRequired,
  filterCols: PropTypes.array.isRequired,
  toggleCols: PropTypes.array,
  handleToggle: PropTypes.func,
  toggleDisabled: PropTypes.bool,
  searchCol: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
    .isRequired,
  sortF: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasLoaded: PropTypes.bool,
  memberFilter: PropTypes.string,
  memberBadge: PropTypes.bool,
  validOnly: PropTypes.bool,
  onFilteredRowsChange: PropTypes.func,
  selectedCrsids: PropTypes.arrayOf(PropTypes.string),
  onSelectRow: PropTypes.func,
  selectionDisabled: PropTypes.bool,
  initialRowsPerPage: PropTypes.number,
};
