import { Button, Container, Flex, Modal, NumberInput, Select } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'

function AddProductionModal({ opened, setOpened, production, handleChange, handleSubmit, products }) {
  return (
    <Modal opened={opened} onClose={() => setOpened(false)} size={600} withCloseButton >
      <Modal.Body sx={{minHeight: 230}}>
        <Select
          label="Product"
          placeholder="Select product"
          data={products.map((prd) => {
            return {
              label: prd.name,
              value: prd._id
            }
          })}
          value={production.product}
          onChange={(val) => handleChange("product", val)}
          searchable
          dropdownPosition="flip"
        />
        <NumberInput
          mt="md"
          label="Production Quantity"
          placeholder="Enter production quantity"
          min={1}
          value={production.quantity}
          onChange={(val) => handleChange("quantity", val)}
        />
        <DatePickerInput
          mt="md"
          label="Date"
          placeholder="Select Date"
          value={production.date}
          onChange={(val) => handleChange("date", val)}
        />
        <Flex justify="space-between" mt={70}>
          <Button onClick={handleSubmit}>Add</Button>
          <Button color="gray" onClick={() => setOpened(false)}>Cancel</Button>
        </Flex>
      </Modal.Body>
    </Modal>
  )
}

export default AddProductionModal