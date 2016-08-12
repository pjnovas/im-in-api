
import {
  sendToken,
  getUser,
  removeToken,
  update
} from '../controller/users';

export default [
  // Validates token and retrieves the user data
  { method: 'GET', path: '/auth', config: getUser },

  // Receives an email property, generates a token and sends it by email
  // if user doesn't exists will create a new one
  // Subsequent call must be a POST /users/login with token received by email
  { method: 'POST', path: '/auth', config: sendToken },

  // (logout) Clears the user token, invalidating any subsequent login
  // will only apply to authenticated user
  { method: 'DELETE', path: '/auth', config: removeToken },

  // Updates a user data - will only update authenticated user
  { method: ['PATCH', 'PUT'], path: '/auth', config: update }
];
