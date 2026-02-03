import {
  Group,
  Text,
  Select,
  ActionIcon,
  Stack,
} from '@mantine/core';
import { IconBell, IconUser } from '@tabler/icons-react';
import moment from 'moment';

function DashboardHeader({ changeLanguage, value, shiftRemainingTime }) {
  return (
    <Group justify="space-between" w="100%">
      {/* App title */}
      <Text fw={700} color="white">
        AEIS
      </Text>

      {/* Right section */}
      <Group gap="sm" visibleFrom="sm">
        <Select
          data={[
            { value: 'en', label: 'English' },
            { value: 'ar', label: 'Arabic' },
          ]}
          value={value}
          onChange={changeLanguage}
          size="xs"
        />

        <Text color="white" size="sm">
          {moment().format('DD-MMM-YYYY')}
        </Text>
      </Group>

      {/* Mobile condensed info */}
      <Stack gap={0} hiddenFrom="sm" align="flex-end">
        <Text size="xs" color="white">
          {moment().format('DD/MM')}
        </Text>
        {shiftRemainingTime && (
          <Text size="xs" color="white">
            {shiftRemainingTime}
          </Text>
        )}
      </Stack>
    </Group>
  );
}

export default DashboardHeader;