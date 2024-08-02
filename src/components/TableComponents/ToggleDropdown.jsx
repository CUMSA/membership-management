import * as React from "react";
import { Dropdown } from "@mui/base/Dropdown";
import { Menu } from "@mui/base/Menu";
import { MenuButton } from "@mui/base/MenuButton";
import { MenuItem, menuItemClasses } from "@mui/base/MenuItem";
import { styled } from "@mui/system";

export default function ToggleDropdown({ attr, currVal, Crsid, handleToggle }) {
  return (
    <Dropdown>
      <TriggerButton currVal={currVal}>{`${currVal}`}</TriggerButton>
      <Menu slots={{ listbox: StyledListbox }}>
        <StyledMenuItem
          onClick={() => {
            handleToggle(!currVal, Crsid);
          }}
          currVal={currVal}
        >
          <p class="action">
            Set "{attr}" to {`${!currVal}`}
          </p>
          <p class="subtitle">This action cannot be undone.</p>
        </StyledMenuItem>
      </Menu>
    </Dropdown>
  );
}

const blue = {
  50: "#F0F7FF",
  100: "#DAECFF",
  200: "#99CCF3",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#f6f8fa",
  100: "#eaeef2",
  200: "#d0d7de",
  300: "#afb8c1",
  400: "#8c959f",
  500: "#6e7781",
  600: "#57606a",
  700: "#424a53",
  800: "#32383f",
  900: "#24292f",
};

const StyledListbox = styled("ul")(
  ({ theme }) => `
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  min-width: 200px;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  box-shadow: 0px 2px 16px ${
    theme.palette.mode === "dark" ? grey[900] : grey[200]
  };
  z-index: 1;
  `
);

const StyledMenuItem = styled(MenuItem)(
  ({ theme, currVal }) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  user-select: none;
  padding: 2px 5px 2px 5px;
  color: ${currVal ? "red" : "green"};
  cursor: pointer;

  &:last-of-type {
    border-bottom: none;
  }

  &.${menuItemClasses.focusVisible} {
    outline: 1px solid ${currVal ? "red" : "green"};
    background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[100]};
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  }

   &:hover:not(.${menuItemClasses.disabled}) {
    background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[100]};
    opacity: 0.5;
    transition: 0.1s;
   }
   > .action {
    margin-bottom: 0;
   }
   > .subtitle {
    color: black;
    font-size: 0.8em;
    margin-top: 0;
   }
  `
);

const TriggerButton = styled(MenuButton)(
  ({ theme, currVal }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  height: 35px;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 4px 16px;
  line-height: 1.5;
  background: transparent;
  border: 0.5px solid ${currVal ? "green" : "#f9514e"};
  color: ${currVal ? "green" : "#f9514e"};
  cursor: pointer;

  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    opacity: 0.5;
    transition: 0.1s;
    border-color: 1px solid ${currVal ? "green" : "red"};
  }

  &:focus-visible {
    border-color: ${blue[400]};
    outline: 3px solid ${theme.palette.mode === "dark" ? blue[500] : blue[200]};
  }
`
);
