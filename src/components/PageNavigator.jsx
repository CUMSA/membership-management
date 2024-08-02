import React from "react";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "@aws-amplify/ui-react/styles.css";

import cumsaBanner from "../assets/cumsa-logo-2.png";

function PageNavigator({
  open,
  handleClick,
  page,
  signOut,
  pageMenuVisible,
  handleClose,
  setPage,
  pageMap,
}) {
  return (
    <div className="headerBanner">
      <div className="imgBanner">
        <img width="150px" src={cumsaBanner} alt="cumsabanner" />
      </div>
      <div className="header">
        <button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          className="dashboard-button"
        >
          <h2>{pageMap[page].name}</h2>
          <ArrowDropDownIcon size={30} />
        </button>
        <button className="signout-btn" onClick={signOut}>
          Sign out
        </button>
      </div>

      <Menu
        id="basic-menu"
        anchorEl={pageMenuVisible}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {pageMap.map((e, i) => {
          return (
            <MenuItem
              onClick={() => {
                setPage(i);
                handleClose();
              }}
              selected={i == page}
            >
              {e.name}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}

export default PageNavigator;
