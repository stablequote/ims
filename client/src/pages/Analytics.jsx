import { useEffect, useState } from 'react'
import { Box, Center, Container, Flex, Grid, Loader, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications';
import axios from 'axios';

function Analytics() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const BASE_URL = import.meta.env.VITE_URL;

    const fetchData = async (url) => {
        try {
            console.log("From inside useEffect...")
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
    <Container size="100%">
        <Title ta="center">Analytics Page</Title>
        <Grid mt="md">
            <Grid.Col span={4} sx={{border: "2px solid black"}}>
                <Text ta="center" fz={26}>Expenses Breakdown</Text>
                <Flex justify="space-between">
                    <Box p="md" sx={{border: "2px solid black"}}>
                        <Text>Total Expenses Today</Text>
                        <Text><strong>SDG {data?.expenses?.today}</strong></Text>
                    </Box>
                    <Box p="md" sx={{border: "2px solid black"}}>
                        <Text>Total Expenses This week</Text>
                        <Text><strong>SDG {data?.expenses?.week}</strong></Text>
                    </Box>
                    <Box p="md" sx={{border: "2px solid black"}}>
                        <Text>Average Expenses per week</Text>
                        <Text><strong>SDG {data?.expenses?.avgWeekly}</strong></Text>
                    </Box>
                </Flex>
            </Grid.Col>
            <Grid.Col span={4} sx={{border: "2px solid black"}}>
                <Text ta="center" fz={26}>Purchases Breakdown</Text>
                <Flex justify="space-between">
                    <Box p="md" sx={{border: "2px solid black"}}>
                        <Text>Purchases Today</Text>
                        <Text><strong>SDG {data?.purchases?.today}</strong></Text>
                    </Box>
                    <Box p="md" sx={{border: "2px solid black"}}>
                        <Text>Purchases This week</Text>
                        <Text><strong>SDG {data?.purchases?.week}</strong></Text>
                    </Box>
                    <Box p="md" sx={{border: "2px solid black"}}>
                        <Text>Average Purchases per week</Text>
                        <Text><strong>SDG {data?.purchases?.avgWeekly}</strong></Text>
                    </Box>
                </Flex>
            </Grid.Col>
            <Grid.Col span={4} sx={{border: "2px solid black"}}>
                <Text ta="center" fz={26}>Production Breakdown</Text>
                <Flex justify="space-between">
                    <Box p="md" sx={{border: "2px solid black"}}>
                        <Text>Production Today</Text>
                        <Text><strong>{data?.production?.today}</strong></Text>
                    </Box>
                    <Box p="md" sx={{border: "2px solid black"}}>
                        <Text>Production Flips Today</Text>
                        <Text><strong>{data?.production?.flipsToday}</strong></Text>
                    </Box>
                    <Box p="md" sx={{border: "2px solid black"}}>
                        <Text>Weekly Total Production</Text>
                        <Text><strong>{data?.production?.week}</strong></Text>
                    </Box>
                </Flex>
            </Grid.Col>
        </Grid>
        <Text mt="md" ta="center" fz={26}>Distribution Breakdown</Text>
        <Grid >
            <Grid.Col span={2}>
                <Box p="md" sx={{border: "2px solid black"}}>
                    <Text>Payment Pending</Text>
                    <Text><strong>{data?.distribution?.pendingCount}</strong></Text>
                </Box>
            </Grid.Col>
            <Grid.Col span={3}>
                <Box p="md" sx={{border: "2px solid black"}}>
                    <Text>Pending Payment Amount</Text>
                    <Text><strong>SDG {data?.distribution?.pendingAmount}</strong></Text>
                </Box>
            </Grid.Col>
            <Grid.Col span={2}>
                <Box p="md" sx={{border: "2px solid black"}}>
                    <Text>Distributions Today</Text>
                    <Text><strong>{data?.distribution?.distributionsToday}</strong></Text>
                </Box>
            </Grid.Col>
            <Grid.Col span={2}>
                <Box p="md" sx={{border: "2px solid black"}}>
                    <Text>Distributions this week</Text>
                    <Text><strong>{data?.distribution?.distributionsWeek}</strong></Text>
                </Box>
            </Grid.Col>
            <Grid.Col span={3}>
                <Box p="md" sx={{border: "2px solid black"}}>
                    <Text>Expected weekly revenue</Text>
                    <Text><strong>450</strong></Text>
                </Box>
            </Grid.Col>
        </Grid>
        <Text my="md" ta="center" fz={26}>Cost & Revenue</Text>
        <Grid>
            <Grid.Col span={4} sx={{border: "2px solid black"}}>
                <Box p="md" sx={{border: "2px solid black"}}>
                    <Text>Unit Cost</Text>
                    <Text><strong>SDG {data?.revenue?.unitCost?.unitCost}</strong></Text>
                </Box>
            </Grid.Col>
            <Grid.Col span={4} sx={{border: "2px solid black"}}>
                <Box p="md" sx={{border: "2px solid black"}}>
                    <Text>Net Revenue Today</Text>
                    <Text><strong>SDG {Math.floor(data?.revenue?.netToday) || 0}</strong></Text>
                </Box>
            </Grid.Col>
            <Grid.Col span={4} sx={{border: "2px solid black"}}>
                <Box p="md" sx={{border: "2px solid black"}}>
                    <Text>Weekly Revenue</Text>
                    <Text><strong>SDG {data?.revenue?.netWeek || 0}</strong></Text>
                </Box>
            </Grid.Col>
        </Grid>
        <Text my="md" ta="center" fz={26}>Inventory</Text>
        <Grid>
            <Grid.Col>
                <Box p="md" sx={{border: "2px solid black"}}>
                    <Text>Current Stock</Text>
                    <Text><strong>{data?.inventory?.availableStock || 0}</strong></Text>
                </Box>
            </Grid.Col>
        </Grid>
        {
            loading && 
            <Center>
                <Loader variant='dots' color="green" size={36} />
            </Center>
        }
    </Container>
  )
}

export default Analytics