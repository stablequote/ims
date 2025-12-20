import React, { useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Text,
  Title,
  Group,
  ActionIcon,
  useMantineTheme,
  Input,
  Select,
  Flex,
  Drawer,
} from "@mantine/core";
import { IconSearch, IconBell, IconUser, IconMenu2 } from "@tabler/icons-react";
import moment from "moment";
import { NavLink } from "react-router-dom";

const DashboardHeader = ({changeLanguage, value, shiftRemainingTime}) => {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const theme = useMantineTheme();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <>
      <Header height={60}  p="md" sx={{backgroundColor: "#1D242E", color: "white"}} >
        <Flex justify="space-between">
          {/* Drawer hamburger menu */}
          {/* <Flex align="center" gap="md">
            <ActionIcon
              variant="filled"
              color="gray"
              onClick={() => setDrawerOpened(true)}
            >
              <IconMenu2 size={20} />
            </ActionIcon>
          <Text color="white" fw="bold">Cashierry</Text>
          </Flex> */}

          <Text color="white" fw="bold">AEIS</Text>
          <Group>
            <Select
              data={[
                {value: "en", label: "English"},
                {value: "ar", label: "Arabic"}
              ]}
              placeholder="Language"
              defaultValue="English"
              value={value}
              onChange={changeLanguage}
            />
            <Text>{moment(Date.now()).format('DD-MMMM-YYYY h:mm A')}</Text>
            <ActionIcon onClick={() => alert("Notifications feature is coming soom...")}>
              <IconBell size={20} />
            </ActionIcon>
            <ActionIcon onClick={() => alert("Profile management is coming soon...")}>
              <IconUser size={20} />
            </ActionIcon>
            <Text color="white">{shiftRemainingTime}</Text>
          </Group>
        </Flex>
      </Header>

       <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        title="Medeq"
        padding="md"
        size="250px"
        overlayOpacity={0.5}
        sx={{ background: '#4962d3ff' }}
      >
        <Flex direction="column" gap="sm">
 
      {/* Visible only for manager/owner */}

      <NavLink
        to="/merchants"
        variant="subtle"
        fullWidth
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
        onClick={() => setDrawerOpened(false)}
      >
        العملاء
      </NavLink>

      {(user?.role === "manager" || user?.role === "owner") && (
        <>
          <NavLink
            to="/products"
            variant="subtle"
            fullWidth
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            onClick={() => setDrawerOpened(false)}
          >
            المنتجات
          </NavLink>

          <NavLink
            to="/distribution"
            variant="subtle"
            fullWidth
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            onClick={() => setDrawerOpened(false)}
          >
            التوزيع
          </NavLink>

          <NavLink
            to="/expenses"
            variant="subtle"
            fullWidth
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            onClick={() => setDrawerOpened(false)}
          >
            المنصرفات
          </NavLink>
        </>
      )}
    </Flex>
    </Drawer>
    </>
  );
};

export default DashboardHeader;