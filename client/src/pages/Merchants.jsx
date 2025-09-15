import { useEffect, useState } from 'react'
import { Box, Button, Container, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications';
import CustomTable from '../components/CustomTable'
import AddMerchantModal from '../components/AddMerchantModal';
import axios from 'axios';
import moment from 'moment'

function Merchants() {
    const [ merchantsData, setMerchantsData ] = useState([])
    const [opened, setOpened] = useState(false);
    const [merchantForm, setMerchantForm] = useState({
        shopName: '',
        ownerName: '',
        phone: '',
        location: '',
        unitSalePrice: 0,
    })

    const BASE_URL = import.meta.env.VITE_URL;

    const columns = [
        { accessorKey: "shopName", header: "Shop Name" },
        { accessorKey: "ownerName", header: "Owner's Name" },
        { accessorKey: "location", header: "Location" },
        { accessorKey: "phone", header: "Phone" },
        { accessorKey: "unitSalePrice", header: "Unit Price" },
        { accessorKey: "createdAt", header: "Addet At", 
            Cell: ({ cell }) => (
                <Box>{moment(cell.getValue()).format("DD-MMMM-YYYY HH:MM")}</Box>
            )
        },
    ]

    useEffect(() => async () => {
        try {
            const url = `http://localhost:5003/merchants/list`;
            const res = await axios.get(url);
            console.log(res)
            if(res.status === 200 || res.status === 304) {
                setMerchantsData(res.data);
            }
        } catch (error) {
            alert("Error occured while fetching merchants")
        }
    }, [merchantsData[0]?._id])

    const handleChange = (field, value) => {
        setMerchantForm((prev) => ({ ...prev, [field]: value }));
    };

    const submitMerchantForm = async () => {
        
        try {
            const url = `http://localhost:5003/merchants/create`
            console.log("URL", url)
            console.log(merchantForm)
            const res = await axios.post(url, merchantForm)
            if(res.status === 201) {
                showNotification({
                    title: 'Success',
                    message: 'Merchant created succesfully',
                    color: 'green'
                })
                setOpened(false)
            }
        } catch (error) {
            showNotification({
                title: 'Error creating a merchant',
                message: error,
                color: 'red'
            })
            console.log(error)
        }
    }

  return (
    <Container size="100%">
        <Button mb='sm' color="green" onClick={() => setOpened(!opened)}>Add Merchant</Button>
        <CustomTable columns={columns} data={merchantsData} />
        <AddMerchantModal 
            opened={opened} 
            setOpened={setOpened} 
            merchantForm={merchantForm} 
            setMerchantForm={setMerchantForm} 
            handleChange={handleChange} 
            submitMerchantForm={submitMerchantForm}
        />
    </Container>
  )
}

export default Merchants