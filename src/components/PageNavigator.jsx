import PropTypes from "prop-types";
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
  onRefresh,
  isRefreshing,
  isUpdating,
  refreshDisabled,
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
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onRefresh} disabled={refreshDisabled}>
            {isRefreshing
              ? "Refreshing..."
              : isUpdating
                ? "Updating..."
                : "Refresh"}
          </button>
          <button className="signout-btn" onClick={signOut}>
            Sign out
          </button>
        </div>
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
              key={i}
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

PageNavigator.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  signOut: PropTypes.func.isRequired,
  pageMenuVisible: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  pageMap: PropTypes.array.isRequired,
  onRefresh: PropTypes.func.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  refreshDisabled: PropTypes.bool.isRequired,
};

export default PageNavigator;
