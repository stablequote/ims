import { Button, Container, Flex, Group, Modal, NumberInput, Select, TextInput } from '@mantine/core'

function PurchaseModal({ open, setOpen, purchaseForm, handleChange, handleSubmit }) {
  return (
    <Modal title="Add Expense" size={800} opened={open} onClose={() => setOpen(!open)}>
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
              data={["Meal", "Fuel", "Bill", "Wage", "Other"]}
              value={purchaseForm.category}
              onChange={(val) => handleChange("category", val)}
              dropdownPosition="top"
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