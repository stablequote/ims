import { useEffect, useState } from 'react'
import { Button, Container, Flex, NumberInput, Radio, Select, Stack, Text, TextInput, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { IconArrowBack, IconArrowForward, IconArrowForwardUp } from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';

function NewDistribution() {
  const [distributionForm, setDistributionForm] = useState({
    shopName: '',
    product: '',
    quantity: 0,
    unitSalePrice: 0,
    paymentStatus: '',
    paymentMethod: '',
    paidAmount: 0,
    transactionNumber: '',
    date: null,
  })
  const [merchants, setMerchants] = useState([]);
  const [products, setProducts] = useState([]);
  const [opened, setOpened] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_URL;

  const handleChange = (field, value) => {
    setDistributionForm((prev) => ({ ...prev, [field]: value }));
  };

  const fetchData = async (merchantsUrl, productsUrl) => {
    try {
      const merchantsResponse = await axios.get(merchantsUrl);
      const productsResponse = await axios.get(productsUrl);
      if(merchantsResponse.status === 200 || merchantsResponse.status === 304) {
        setMerchants(merchantsResponse.data);
        setProducts(productsResponse.data);
      }
    } catch (error) {
      showNotification({
        title: "Error",
        message: "An error occured while fetching data",
        color: "red"
      })
    }
  }

  useEffect(() => async () => {
    const merchantsUrl = `${BASE_URL}/merchants/list`;
    const productsUrl =  `${BASE_URL}/products/list`;
    fetchData(merchantsUrl, productsUrl)
  }, [])

  const handleSubmit = async () => {
    try {
      const url = `${BASE_URL}/distributions/create`;

      const payload = {
        merchant: distributionForm.shopName,
        quantity: distributionForm.quantity,
        unitSalePrice: distributionForm.unitSalePrice,
        paymentStatus: distributionForm.paymentStatus,
        paymentMethod: distributionForm.paymentMethod,
        transactionNumber: distributionForm.transactionNumber,
        items: [
          {product: distributionForm.product}
        ],
        paidAmount: distributionForm.paidAmount,
        date: distributionForm?.date?.toISOString() || null,
      }
      console.log("Payload: ", payload);

      const res = await axios.post(url, payload);
      console.log("Response: ", res)
      if(res.status === 201) {
        showNotification({
          title: "Success",
          message: "Distribution has been added successfully",
          color: "green"
        })
        
        setOpened(false)
        // setStock(...prev, res.data)
        // setDistributionForm({})
        navigate("/distribution/list")
      } else {
        showNotification({
        title: "Server Error",
        message: res.data.message,
        color: "red"
      })
      }
    } catch (error) {
      showNotification({
        title: "Error",
        message: error,
        color: "red"
      })
    }
  }

  return (
    <Container size="lg">
      <Title ta="center" >توزيع جديد</Title>
      <Select 
        // mt="md"
        label="Shop Name"
        placeholder="Select Shop"
        data={merchants?.map((merchant) => {
          return {
            label: merchant.shopName,
            value: merchant._id
          }
        })}
        value={distributionForm.shopName}
        onChange={(val) => handleChange("shopName", val)}
      />
      <Select 
        mt="md"
        label="Product"
        placeholder="Select Product"
        data={products?.map((product) => {
          return {
            label: product.name,
            value: product._id
          }
        })}
        value={distributionForm.product}
        onChange={(val) => handleChange("product", val)}
      />
      <NumberInput 
        mt="md"
        label="Quantity"
        placeholder="enter quantity"
        min={1}
        value={distributionForm.quantity}
        onChange={(val) => handleChange("quantity", val)}
      />
      <NumberInput 
        mt="md"
        label="Price"
        placeholder="enter price"
        precision={2}
        value={distributionForm.unitSalePrice}
        onChange={(val) => handleChange("unitSalePrice", val)}
      />
      <Stack mt="md">
        {/* <Text>Payment Status</Text> */}
        {/* <Radio 
          label="Pending"
          placeholder="select payment status"
        />
        <Radio 
          label="Paid"
          placeholder="select payment status"
          value={distributionForm.paymentStatus}
          onChange={(e) => setDistributionForm(e.currentTarget.value)}
        /> */}

        <DatePickerInput
          label="Date"
          placeholder="Select Date"
          value={distributionForm.date}
          onChange={(val) => handleChange("date", val)}
        />

        <Select 
          label="Payment Status"
          placeholder="Select payment status"
          data={["Pending", "Paid", "Partial"]}
          value={distributionForm.paymentStatus}
          onChange={(val) => handleChange("paymentStatus", val)}
        />
        {
          distributionForm.paymentStatus === "Paid" ||  distributionForm.paymentStatus === "Partial" &&
          <Select 
            mt="md"
            label="Payment Method"
            placeholder="Select payment method"
            data={["Cash", "Bankak"]}
            value={distributionForm.paymentMethod}
            onChange={(val) => handleChange("paymentMethod", val)}
        />
        }
        {
          distributionForm.paymentMethod === "Bankak" &&
          <TextInput 
            label="Transaction Number"
            placeholder="entr trx. number"
            value={distributionForm.transactionNumber}
            onChange={(e) => handleChange("transactionNumber", e.currentTarget.value)}
          />
        }
      </Stack>
      <Flex justify="space-between" mt="md">
        <Button color="blue" onClick={handleSubmit} >Submit</Button>
        <Button color="orange" variant='outline' rightIcon={<IconArrowForwardUp />} component={NavLink} to="/distribution/list" >Back</Button>
      </Flex>
    </Container>
  )
}

export default NewDistribution