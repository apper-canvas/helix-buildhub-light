import { delay } from '../index'

let expenses = null

const loadExpenses = async () => {
  if (!expenses) {
    const response = await import('../mockData/expenses.json')
    expenses = response.default
  }
  return expenses
}

const expenseService = {
  async getAll() {
    await delay(300)
    const data = await loadExpenses()
    return [...data]
  },

  async getById(id) {
    await delay(200)
    const data = await loadExpenses()
    const expense = data.find(e => e.id === id)
    return expense ? { ...expense } : null
  },

  async create(expenseData) {
    await delay(400)
    const data = await loadExpenses()
    const newExpense = {
      id: Date.now().toString(),
      ...expenseData
    }
    data.push(newExpense)
    return { ...newExpense }
  },

  async update(id, expenseData) {
    await delay(350)
    const data = await loadExpenses()
    const index = data.findIndex(e => e.id === id)
    if (index !== -1) {
      data[index] = { ...data[index], ...expenseData }
      return { ...data[index] }
    }
    throw new Error('Expense not found')
  },

  async delete(id) {
    await delay(250)
    const data = await loadExpenses()
    const index = data.findIndex(e => e.id === id)
    if (index !== -1) {
      const deleted = data.splice(index, 1)[0]
      return { ...deleted }
    }
    throw new Error('Expense not found')
  }
}

export default expenseService