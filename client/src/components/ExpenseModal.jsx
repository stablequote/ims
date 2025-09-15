import { Button, Container, Flex, Group, Modal, NumberInput, Select, TextInput } from '@mantine/core'

function ExpenseModal({ open, setOpen, expenseForm ,handleChange, handleSubmit }) {
  return (
    <Modal title="Add Expense" size={800} opened={open} onClose={() => setOpen(!open)}>
        <Modal.Body>
          <Container size="lg">
            <NumberInput 
              label="Amount" 
              placeholder='type amount' 
              value={expenseForm.amount} 
              onChange={(val) => handleChange("amount", val)}
              precision={2}
            />
            <TextInput 
              label="Description" 
              placeholder='write description'  
              value={expenseForm.description}
              onChange={(e) => handleChange("description", e.currentTarget.value)} 
            />
            <Select
              my="md"
              label="Payment Method"
              placeholder="Pick payment method"
              data={["Cash", "Bankak"]}
              value={expenseForm.paymentMethod}
              onChange={(val) => handleChange("paymentMethod", val)}
            />
            <Select
              label="Category"
              placeholder="Choose category"
              data={["Meal", "Fuel", "Bill", "Wage", "Other"]}
              value={expenseForm.category}
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

export default ExpenseModal