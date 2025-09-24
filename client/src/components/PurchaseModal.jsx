import { Button, Container, Flex, Group, Modal, NumberInput, Select, TextInput } from '@mantine/core'
import { DateInput, DatePickerInput } from '@mantine/dates'

function PurchaseModal({ open, setOpen, purchaseForm, handleChange, handleSubmit }) {
  return (
    <Modal title="إضافة شراء" size={800} opened={open} onClose={() => setOpen(!open)}>
        <Modal.Body>
          <Container size="lg">
            <NumberInput
              label="Cost" 
              placeholder='type cost' 
              value={purchaseForm.totalCost} 
              onChange={(val) => handleChange("totalCost", val)}
              precision={2}
            />
            <TextInput
              mt="md"
              label="Description" 
              placeholder='write description'  
              value={purchaseForm.description}
              onChange={(e) => handleChange("description", e.currentTarget.value)} 
            />
            <Select
              my="md"
              label="Payment Method"
              placeholder="Pick payment method"
              data={["Cash", "Bankak"]}
              value={purchaseForm.paymentMethod}
              onChange={(val) => handleChange("paymentMethod", val)}
            />
            <Select
              label="Category"
              placeholder="Choose category"
              data={["Material"]}
              value={purchaseForm.category}
              onChange={(val) => handleChange("category", val)}
              dropdownPosition="top"
            />
            <DatePickerInput 
              mt="md"
              label="Date"
              placeholder="Select Date"
              value={purchaseForm.date}
              onChange={(val) => handleChange("date", val)}
            />
            <Flex mt="xl"  mb={0} justify="space-between">
              <Button color="blue" onClick={handleSubmit}>Create</Button>
              <Button color="gray" onClick={() => setOpen(!open)}>Cancel</Button>
            </Flex>
          </Container>
        </Modal.Body>
    </Modal>
  )
}

export default PurchaseModal