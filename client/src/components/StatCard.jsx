import { Card, Text } from "@mantine/core";

const StatCard = ({ title, value }) => (
  <Card withBorder radius="md" p="md" shadow="sm">
    <Text size="sm" c="dimmed">
      {title}
    </Text>
    <Text size="xl" fw={700}>
      {value}
    </Text>
  </Card>
);

export default StatCard;