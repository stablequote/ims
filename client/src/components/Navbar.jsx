import React from 'react';
import { NavLink } from 'react-router-dom';
import { Accordion, Button, Divider, Navbar } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
// import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next';

const AppNavbar = () => {

  const activeStyle = {
    backgroundColor: '#009099', // Light background for the active link
    fontWeight: 'bold',        // Highlight the text
    borderRadius: '4px',       // Rounded edges for better UI
  };

  const isMobile = useMediaQuery('(max-width: 375px)');

//   const { logout } = useAuth()
  const { t } = useTranslation()

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  return (
    <Navbar width={!isMobile ? { base: 250 } : 100} p="xs" sx={{ background: '#1D242E' }}>
      <NavLink to="/home" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        {t("Home")}
      </NavLink>

      {/* <NavLink to="/inventory" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        {t("INVENTORY")}
      </NavLink> */}
   

      {(role === "owner" || role === "manager") && (
        <NavLink to="/merchants" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
          {t("MERCHANTS")}
        </NavLink>
      )}

      <Divider size={1} my={10} />

      <NavLink to="/purchases" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        {t("PURCHASES")}
      </NavLink>

       <NavLink to="/expenses" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        {t("EXPENSES")}
      </NavLink>

      <Divider size={1} my={10} />

      <NavLink to="/products" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        {t("PRODUCTS")}
      </NavLink>
      
      {/* <Accordion>
        <Accordion.Control>DISTRIBUTION</Accordion.Control>
        <Accordion.Item>
          <Accordion.Panel>
            <NavLink to="/distribution" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
              {t("DISTRIBUTION")}
            </NavLink>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion> */}

      <Accordion chevronPosition="right" p={0} >
        <Accordion.Item value='distribution' sx={{border: 0}}>
          <Accordion.Control sx={{color: "white", width: "100%", padding: 6, "&:hover": { color: "black"}}}>DISTRIBUTION</Accordion.Control>
          <Accordion.Panel sx={{width: "100%"}}>
            <NavLink to="/distribution/new" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
              {t("New")}
            </NavLink>
          </Accordion.Panel>
          <Accordion.Panel sx={{width: "100%"}}>
            <NavLink to="/distribution/tickets" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
              {/* <IconScissorsOff size={36}/> */}
              {t('Open Tickets')}
            </NavLink>
          </Accordion.Panel>
          <Accordion.Panel sx={{width: "100%"}}>
            <NavLink to="/distribution/list" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
              {/* <IconScissorsOff size={36}/> */}
              {t('List')}
            </NavLink>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    

      <Divider size={1} my={10} />

      {(role === "owner" || role === "manager") && (
        <NavLink to="/analytics" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
          {t("ANALYTICS")}
        </NavLink>
      )}

      <Divider size={1} my={10} />

      {(role === "owner" || role === "manager") && (
      <NavLink to="/profile" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        {t("USERS MANAGEMENT")}
      </NavLink>
      )}

      <Button
        color="red"
        mt="lg"
        // onClick={logout}
        sx={{ position: "absolute", bottom: 22, left: 10, width: "90%" }}
      >
        {t("LOGOUT")}
      </Button>
    </Navbar>
  );
};

export default AppNavbar;
