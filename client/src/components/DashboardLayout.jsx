import {
  AppShell,
  Drawer,
  Burger,
  Group,
  Box,
  Flex,
  Text,
  Image
} from '@mantine/core';
import { NavLink, Outlet } from 'react-router-dom';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';

import AppNavbar from './Navbar';
import DashboardHeader from './DashboardHeader';
import Logo from '../assets/logo.png'

function DashboardWrapper({ changeLanguage, value }) {
  // const [drawerOpened, { toggle, close }] = useDisclosure(false);
  const [drawerOpened, setDrawerOpened] = useState(false);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const [remaining, setRemaining] = useState('');
  const [mounted, setMounted] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const activeStyle = {
    backgroundColor: '#5d5c5fff', // Light background for the active link
    fontWeight: 'bold',        // Highlight the text
    borderRadius: '4px',       // Rounded edges for better UI
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.role !== 'staff') return;

    const interval = setInterval(() => {
      const end = new Date(localStorage.getItem('shiftEndTime'));
      const now = new Date();
      const diff = end - now;

      if (diff <= 0) {
        clearInterval(interval);
        alert('Your shift has ended. Logging you out!');
        handleLogout();
      } else {
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setRemaining(`${h}h ${m}m ${s}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <>
      {/* 🔹 MOBILE DRAWER NAVIGATION */}
      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        title="AEIS"
        padding="md"
        size="250px"
        overlayOpacity={0.5}
        // style={{ background: '#1D242E !important' }}
        styles={(theme) => ({
          body: {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : "#1c3448",
            paddingTop: 10,
          },
        })}
      >
        <AppNavbar onNavigate={() => setDrawerOpened(false)}/>
      </Drawer>

      <AppShell
        padding="md"
        sx={{ backgroundColor: "steelblue" }}
        navbar={
          !isMobile ? (
            <AppNavbar />
          ) : null
        }
        header={
          <Box
            sx={{
              height: 56,
              display: 'flex',
              alignItems: 'center',
              paddingInline: 16,
            }}
          >
            <Group w="100%" position="apart">
              {/* <Text ta="center" color="white">AEIS</Text> */}
              <Image
                src={Logo}
                width={120}
                height={80}
                alt='AEIS'
                fit="contain"
              />
              {/* Burger only on mobile */}
              {isMobile && (
                <Burger
                  opened={drawerOpened}
                   onClick={() => setDrawerOpened(true)}
                  color="white"
                />
              )}
            </Group>
          </Box>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
            paddingTop: 10,
          },
        })}
      >
        <Outlet />
      </AppShell>
    </>
  );
}

export default DashboardWrapper;