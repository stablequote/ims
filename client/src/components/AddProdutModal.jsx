import { Button, Flex, Modal, NumberInput, Select, Text, TextInput } from '@mantine/core'
import React from 'react'

function AddProdutModal({ opened, setOpened, productForm, handleSubmit, handleChange }) {
  return (
    <Modal size={800} opened={opened} withCloseButton onClose={() => setOpened(false)}>
      <Text>Add Prouct</Text>
      <TextInput
        mt="md"
        label="Product Name"
        placeholder="Enter product name"
        value={productForm.name}
        onChange={(e) => handleChange("name", e.currentTarget.value)}
      />
      <NumberInput
        mt="md"
        label="سعر التكلفة"
        placeholder="Enter whole price"
        precision={2}
        value={productForm.wholePrice}
        onChange={(val) => handleChange("wholePrice", val)}
      />
      <NumberInput
        mt="md"
        label="سعر البيع"
        placeholder="Enter retail price"
        precision={2}
        value={productForm.retailPrice}
        onChange={(val) => handleChange("retailPrice", val)}
      />
      <Select
        mt="md"
        label="Category"
        placeholder="Select category"
        data={["Ice Cream", "Pippets", "Cast Template"]}
        value={productForm.category}
        onChange={(val) => handleChange("category", val)}
      />
      <Flex mt="lg" justify="space-between">
        <Button color="green" onClick={handleSubmit}>Add</Button>
        <Button color="gray"  onClick={() => setOpened(false)}>Cancel</Button>
      </Flex>
    </Modal>
  )
}

export default AddProdutModal