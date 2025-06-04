import userData from '../mockData/users.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class UserService {
  constructor() {
    this.users = [...userData]
  }

  async getAll() {
    await delay(200)
    return [...this.users]
  }

  async getById(id) {
    await delay(150)
    const user = this.users.find(u => u.id === id)
    if (!user) {
      throw new Error('User not found')
    }
    return { ...user }
  }

  async create(userData) {
    await delay(300)
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    this.users.push(newUser)
    return { ...newUser }
  }

  async update(id, updateData) {
    await delay(250)
    const index = this.users.findIndex(u => u.id === id)
    if (index === -1) {
      throw new Error('User not found')
    }
    
    const updatedUser = {
      ...this.users[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    this.users[index] = updatedUser
    return { ...updatedUser }
  }

  async delete(id) {
    await delay(200)
    const index = this.users.findIndex(u => u.id === id)
    if (index === -1) {
      throw new Error('User not found')
    }
    
    const deletedUser = this.users.splice(index, 1)[0]
    return { ...deletedUser }
  }
}

export default new UserService()