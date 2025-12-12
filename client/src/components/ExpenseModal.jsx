import { Button, Container, Flex, Group, Modal, NumberInput, Select, TextInput } from '@mantine/core'
import { DateInput, DatePickerInput } from '@mantine/dates'
function ExpenseModal({ open, setOpen, expenseForm ,handleChange, handleSubmit }) {
  return (
    <Modal title="إضافة منصرف" size={800} opened={open} onClose={() => setOpen(!open)}>
        <Modal.Body>
          <Container size="lg">
            <NumberInput 
              label="المبلغ" 
              placeholder='type amount' 
              value={expenseForm.amount} 
              onChange={(val) => handleChange("amount", val)}
              precision={2}
            />
            <TextInput
              mt="md"
              label="الوصف"
              placeholder='write description'
              value={expenseForm.description}
              onChange={(e) => handleChange("description", e.currentTarget.value)}
            />
            <Select
              my="md"
              label="طريقة الدفع"
              placeholder="Pick payment method"
              data={["Cash", "Bankak"]}
              value={expenseForm.paymentMethod}
              onChange={(val) => handleChange("paymentMethod", val)}
            />
            <Select
              label="الفئة"
              placeholder="Choose category"
              data={["Meal", "Fuel", "Bill", "Wage", "Other"]}
              value={expenseForm.category}
              onChange={(val) => handleChange("category", val)}
              dropdownPosition="top"
            />
            <DatePickerInput 
              mt="md"
              label="التاريخ"
              placeholder="Select Date"
              value={expenseForm.date}
              onChange={(val) => handleChange("date", val)}
            />
            <Flex mt="xl"  mb={0} justify="space-between">
              <Button color="green" onClick={handleSubmit}>إضافة</Button>
              <Button color="gray" onClick={() => setOpen(!open)}>إلغاء</Button>
            </Flex>
          </Container>
        </Modal.Body>
    </Modal>
  )
}

export default ExpenseModal