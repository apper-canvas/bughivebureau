// Service layer exports
import ticketService from './api/ticketService'
import commentService from './api/commentService'
import testCaseService from './api/testCaseService'
import userService from './api/userService'

export {
  ticketService,
  commentService,
  testCaseService,
  userService
}
export { default as userService } from './api/userService.js'
export { default as commentService } from './api/commentService.js'
export { default as testCaseService } from './api/testCaseService.js'