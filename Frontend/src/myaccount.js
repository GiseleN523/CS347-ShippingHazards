import React from 'react';
import './myaccount.css'; // Import CSS file
import HeaderAndNav from './header_and_nav.js';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'; // Import necessary components from react-pro-sidebar package
import SettingsApplicationsRoundedIcon from '@mui/icons-material/SettingsApplicationsRounded'; // Import icon component from Material-UI Icons
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';


let playerID;

const AccountPageSidebar = () => {
  return (
    <div style={{ display: "flex", height: "50vh" }}>
      <Sidebar className="app">
        <Menu>
          <MenuItem> <h1> Welcome </h1> </MenuItem>
          <MenuItem icon={<AccountCircleRoundedIcon />}> Profile </MenuItem>
          <MenuItem icon={<TimelineRoundedIcon/>}> <Link to={`/myaccount/stats/${playerID}`}> Stats </Link> </MenuItem>
          <MenuItem icon={<SettingsApplicationsRoundedIcon />}> Settings </MenuItem>
        </Menu>
      </Sidebar>

    </div>
  );
};

function MyAccount() {
  ({ playerID } = useParams());
  return (
    <div>
      <HeaderAndNav playerID={playerID} />
      <AccountPageSidebar />
    </div>
  );
}

export default MyAccount;