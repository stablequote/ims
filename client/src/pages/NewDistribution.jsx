import { Button, Container, Flex, NumberInput, Radio, Select, Stack, Text, Title } from '@mantine/core'
import React from 'react'

function NewDistribution() {
  return (
    <Container size="lg">
      <Title>New Delivery</Title>
      <Select 
        mt="md"
        label="Shop Name"
        placeholder="Select Shop"
        data={["Al Rayyan", "Esterlini", "Alyageen"]}
      />
      <Select 
        mt="md"
        label="Product"
        placeholder="Select Product"
        data={["Mango Ice Cream", "Pineapple Ice Cream", "Vanilla Ice Cream"]}
      />
      <NumberInput 
        mt="md"
        label="Quantity"
        placeholder="enter quantity"
        min={1}
      />
      <NumberInput 
        mt="md"
        label="Price"
        placeholder="enter price"
        precision={2}
      />
      <Stack mt="md">
        <Text>Payment Status</Text>
        <Radio 
          label="Pending"
          placeholder="select payment status"
        />
        <Radio 
          label="Paid"
          placeholder="select payment status"
        />
        <Select 
          mt="md"
          label="Payment Methid"
          placeholder="Select payment method"
          data={["Cash", "Bankak"]}
        />
      </Stack>
      <Flex justify="space-between" mt="md">
        <Button color="blue" >Submit</Button>
        <Button color="gray" >Cancel</Button>
      </Flex>
    </Container>
  )
}

export default NewDistribution