import React, { useEffect, useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import HeaderRow from "./TableComponents/HeaderRow";
import ToggleDropdown from "./TableComponents/ToggleDropdown";

import loadingGif from "../assets/loading-gif.gif";
import { Typography } from "@mui/material";

export default function DataTable({
  rows,
  filterCols,
  toggleCols,
  handleToggle,
  searchCol,
  sortF,
  isLoading,
  memberFilter = "all",
  memberBadge = false,
  validOnly = false,
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
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedAttribute, setSelectedAttribute] = useState("MembershipType");
  const [countsByAttribute, setCountsByAttribute] = useState({}); // { attribute: count }
  const [tableData, setTableData] = useState([]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    setDispData(rows.sort(sortF));
  }, [rows]);

  useEffect(() => {
    const f = async () => {
      setIsFiltering(true);
      const d = rows
        .filter((d) => !search.Crsid || d.Crsid.startsWith(search.Crsid))
        .filter((d) => !search.College || d.College === search.College)
        .filter(
          (d) =>
            !search.FirstName ||
            d.FirstName.toLowerCase().startsWith(search.FirstName.toLowerCase())
        )
        .filter(
          (d) =>
            !search.LastName ||
            d.LastName.toLowerCase().startsWith(search.LastName.toLowerCase())
        )
        .filter(
          (d) =>
            !search.Course ||
            d.Course.toLowerCase().startsWith(search.Course.toLowerCase())
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
        .filter((d) => !search.Scholarship || d.Scholarship.toLowerCase().startsWith(search.Scholarship.toLowerCase()))
        .filter((d) => !search.Nationality || d.Nationality.toLowerCase().startsWith(search.Nationality.toLowerCase()))
        .filter((data) => !validOnly || (data.Paid && data.CardIssued && !data.Expired))  // Filter valid members
        .sort(sortF);
      setDispData(d);

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
  }, [search, memberFilter, validOnly, selectedAttribute]);

  useEffect(() => {
    setIsFiltering(false);
  }, [dispData]);

  return (
    <div style={{ height: 400, width: "100%" }}><div style={{ marginBottom: "20px" }}>
      <h2>
        Breakdown By Attribute
      </h2>
      <Select onChange={
        (e) => {
          setSelectedAttribute(e.target.value);
        }
      } placeholder="Select an attribute" value={selectedAttribute}>
        {
          filterCols.map((col) => (
            <MenuItem key={col} value={col}>{col}</MenuItem>
          ))
        }
      </Select>

      {selectedAttribute && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {selectedAttribute}
              </TableCell>
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
            />

            {/* Data */}
            {!isFiltering &&
              dispData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((data) => {
                  let badgeCard;

                  if (!data.Paid)
                    badgeCard = (<div className="badge paid">Not Paid</div>);
                  else if (!data.CardIssued && data.Paid)
                    badgeCard = (<div className="badge card">Card Not Issued</div>);
                  else if (data.Expired)
                    badgeCard = (<div className="badge expire">Expired</div>);
                  else if (data.Paid && data.CardIssued && !data.Expired)
                    badgeCard = (<div className="badge valid">Valid</div>);

                  return <>
                    {memberBadge && <div className="badgeContainer">
                      {badgeCard}
                    </div>}

                    <TableRow key={data.Crsid}>
                      {/* Toggle */}
                      {toggleCols &&
                        toggleCols.map((c) => (
                          <TableCell>
                            <ToggleDropdown
                              currVal={data[c]}
                              attr={c}
                              Crsid={data.Crsid}
                              handleToggle={handleToggle}
                            />
                          </TableCell>
                        ))}

                      {/* Columns to see */}
                      {filterCols
                        .filter((x) => !toggleCols || !toggleCols.includes(x))
                        .map((c) => (
                          <TableCell>{`${data[c]}`}</TableCell>
                        ))}
                    </TableRow></>
                })}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody >
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
            <Typography>No records to show</Typography>
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
        page={page}
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
