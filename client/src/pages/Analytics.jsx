import { useEffect, useState } from 'react'
import { Box, Center, Container, Flex, Grid, Loader, Skeleton, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import StatCard from '../components/StatCard';

function Analytics() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const BASE_URL = import.meta.env.VITE_URL;

    const fetchData = async (url) => {
        try {
            setLoading(true)
            const res = await axios.get(url);
            setData(res.data)           
        } catch (error) {
            showNotification({
                title: "Error",
                message: "Error loading data",
                color: "red"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const url = `${BASE_URL}/reports/analytics`;
        fetchData(url)
    }, [])
  
  return (
    <Container size="xl">
      <Title ta="center" mb="md">
        Analytics
      </Title>

        {/* ================= INVENTORY ================= */}
      <Title order={4} mt="lg" mb="xs">
        Inventory
      </Title>
      <Grid mb="sm">
        <Grid.Col xs={12} sm={4}>
          <StatCard
            title="Available Stock"
            value={data?.inventory?.availableStock || 0}
          />
        </Grid.Col>
      </Grid>

      {/* ================= EXPENSES ================= */}
      <Title order={4} mb="xs">
        Expenses
      </Title>
      <Grid>
        <Grid.Col xs={12} sm={4}>
          <StatCard
            title="Expenses Today"
            value={`SDG ${data?.expenses?.today || 0}`}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={4}>
          <StatCard
            title="Expenses This Week"
            value={`SDG ${data?.expenses?.week || 0}`}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={4}>
          <StatCard
            title="Avg Weekly Expenses"
            value={`SDG ${data?.expenses?.avgWeekly || 0}`}
          />
        </Grid.Col>
      </Grid>

      {/* ================= PURCHASES ================= */}
      <Title order={4} mt="lg" mb="xs">
        Purchases
      </Title>
      <Grid>
        <Grid.Col xs={12} sm={4}>
          <StatCard
            title="Purchases Today"
            value={`SDG ${data?.purchases?.today || 0}`}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={4}>
          <StatCard
            title="Purchases This Week"
            value={`SDG ${data?.purchases?.week || 0}`}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={4}>
          <StatCard
            title="Avg Weekly Purchases"
            value={`SDG ${data?.purchases?.avgWeekly || 0}`}
          />
        </Grid.Col>
      </Grid>

      {/* ================= PRODUCTION ================= */}
      <Title order={4} mt="lg" mb="xs">
        Production
      </Title>
      <Grid>
        <Grid.Col xs={12} sm={4}>
          <StatCard
            title="Production Today"
            value={data?.production?.today || 0}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={4}>
          <StatCard
            title="Flips Today"
            value={data?.production?.flipsToday || 0}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={4}>
          <StatCard
            title="Weekly Production"
            value={data?.production?.week || 0}
          />
        </Grid.Col>
      </Grid>

      {/* ================= DISTRIBUTION ================= */}
      <Title order={4} mt="lg" mb="xs">
        Distribution
      </Title>
      <Grid>
        <Grid.Col xs={12} sm={4}>
          <StatCard
            title="Pending Payments"
            value={data?.distribution?.pendingCount || 0}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={4}>
          <StatCard
            title="Pending Amount"
            value={`SDG ${data?.distribution?.pendingAmount || 0}`}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={4}>
          <StatCard
            title="Distributed Qty Today"
            value={data?.distribution?.distributionsQuantityToday || 0}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={4}>
          <StatCard
            title="Distributions Today"
            value={data?.distribution?.distributionsToday || 0}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={4}>
          <StatCard
            title="Distributed Qty (Week)"
            value={data?.distribution?.distributionsQuantityWeek || 0}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={4}>
          <StatCard
            title="Distributions This Week"
            value={data?.distribution?.distributionsWeek || 0}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={4}>
          <StatCard title="Expected Weekly Revenue" value="SDG 450" />
        </Grid.Col>
      </Grid>

      {/* ================= REVENUE ================= */}
      <Title order={4} mt="lg" mb="xs">
        Revenue
      </Title>
      <Grid>
        <Grid.Col xs={12} sm={4}>
          <StatCard
            title="Unit Cost"
            value={`SDG ${data?.revenue?.unitCost?.unitCost || 0}`}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={4}>
          <StatCard
            title="Income Today"
            value={`SDG ${Math.floor(data?.revenue?.netToday) || 0}`}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={4}>
          <StatCard
            title="Weekly Revenue"
            value={`SDG ${data?.revenue?.netWeek || 0}`}
          />
        </Grid.Col>
      </Grid>

      {loading && (
        <Center mt="lg">
          {/* <Loader variant="dots" size="lg" /> */}
          <Skeleton height={50} circle mb="xl"  />
        </Center>
      )}
    </Container>
  )
}

export default Analytics