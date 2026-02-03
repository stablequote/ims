import { NavLink } from 'react-router-dom';
import { Accordion, Button, Divider, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';

const activeStyle = {
  backgroundColor: '#009099',
  fontWeight: 'bold',
  borderRadius: '6px',
};

function AppNavbar({ onNavigate }) {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;

  const linkProps = ({ isActive }) => ({
    style: isActive ? activeStyle : undefined,
    onClick: onNavigate,
  });

  return (
    <Stack gap="xs" p="xs" sx={{ height: '100%' }}>
      {(role === 'owner' || role === 'manager') && (
        <NavLink to="/merchants" {...linkProps} onClick={onNavigate}>
          {t('العملاء')}
        </NavLink>
      )}

      <Divider />

      <NavLink to="/products" {...linkProps} onClick={onNavigate}>
        {t('المنتجات')}
      </NavLink>

      <NavLink to="/purchases" {...linkProps} onClick={onNavigate}>
        {t('المشتريات')}
      </NavLink>

      <NavLink to="/expenses" {...linkProps} onClick={onNavigate}>
        {t('المنصرفات')}
      </NavLink>

      <Divider />

      <NavLink to="/production" {...linkProps} onClick={onNavigate}>
        {t('الإنتاج والمخزن')}
      </NavLink>

      <Divider />

      <Accordion chevronPosition="right" variant="contained" sx={{backgroundColor: "#1D242E !important"}}>
        <Accordion.Item value="distribution" sx={{backgroundColor: "#1d242e !important"}}>
          <Accordion.Control sx={{color: "white !important"}}>{t('التوزيع')}</Accordion.Control>

          <Accordion.Panel >
            <NavLink to="/distribution/new" {...linkProps} onClick={onNavigate}>
              {t('توزيع جديد')}
            </NavLink>
          </Accordion.Panel>

          <Accordion.Panel>
            <NavLink to="/distribution/tickets" {...linkProps} onClick={onNavigate} color='black'>
              {t('الطلبات المعلقة')}
            </NavLink>
          </Accordion.Panel>

          <Accordion.Panel>
            <NavLink to="/distribution/list" {...linkProps} onClick={onNavigate}>
              {t('قائمة الطلبات')}
            </NavLink>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Divider />

      {(role === 'owner' || role === 'manager') && (
        <NavLink to="/analytics" {...linkProps} onClick={onNavigate}>
          {t('التحليلات')}
        </NavLink>
      )}

      <Button
        color="red"
        mt="auto"
        onClick={() => {
          localStorage.clear();
          window.location.href = '/login';
        }}
      >
        {t('LOGOUT')}
      </Button>
    </Stack>
  );
}

export default AppNavbar;