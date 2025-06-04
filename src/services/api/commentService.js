import commentData from '../mockData/comments.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class CommentService {
  constructor() {
    this.comments = [...commentData]
  }

  async getAll() {
    await delay(200)
    return [...this.comments]
  }

  async getById(id) {
    await delay(150)
    const comment = this.comments.find(c => c.id === id)
    if (!comment) {
      throw new Error('Comment not found')
    }
    return { ...comment }
  }

  async getByTicketId(ticketId) {
    await delay(200)
    return this.comments.filter(c => c.ticketId === ticketId).map(c => ({ ...c }))
  }

  async create(commentData) {
    await delay(300)
    const newComment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    this.comments.push(newComment)
    return { ...newComment }
  }

  async update(id, updateData) {
    await delay(250)
    const index = this.comments.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('Comment not found')
    }
    
    const updatedComment = {
      ...this.comments[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    this.comments[index] = updatedComment
    return { ...updatedComment }
  }

  async delete(id) {
    await delay(200)
    const index = this.comments.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('Comment not found')
    }
    
    const deletedComment = this.comments.splice(index, 1)[0]
    return { ...deletedComment }
  }
}

export default new CommentService()