import { useEffect, useState } from 'react'
import { Button, Container, Flex, NumberInput, Radio, Select, Stack, Text, TextInput, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { IconArrowBack, IconArrowForward, IconArrowForwardUp } from '@tabler/icons-react';

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
  })
  const [merchants, setMerchants] = useState([]);
  const [products, setProducts] = useState([]);
  const [opened, setOpened] = useState(false);

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setDistributionForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => async () => {
    try {
      const merchantsUrl = `http://localhost:5003/merchants/list`;
      const productsUrl =  `http://localhost:5003/products/list`;

      const merchantsResponse = await axios.get(merchantsUrl);
      const productsResponse = await axios.get(productsUrl);

      setMerchants(merchantsResponse.data);
      setProducts(productsResponse.data);

      console.log("Merchants: ", merchantsResponse);
      console.log("Products: ", productsResponse);
    } catch (error) {
      alert(error)
    }
  }, [])

  const handleSubmit = async () => {
    try {
      const url = `http://localhost:5003/distributions/create`;

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
      }
      console.log("Payload: ", payload);

      const res = await axios.post(url, payload);
      if(res.status === 201) {
        showNotification({
          title: "Success",
          message: "Distribution has been added successfully",
          color: "green"
        })
        setOpened(false)
        // setStock(...prev, res.data)
        setDistributionForm({})
        navigate("/distribution/list")
      }
    } catch (error) {
      showNotification({
        title: "Error",
        message: error,
        color: "red"
      })
      alert(error.message)
    }
  }

  return (
    <Container size="lg">
      <Title>New Delivery</Title>
      <Select 
        mt="md"
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