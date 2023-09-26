const User = require("../models/user");
const { getCredentials } = require("../utils/requestUtils");


/**
 * Get current user based on the request headers
 *
 * @param {http.IncomingMessage} request a request
 * @returns {object|null} current authenticated user or null if not yet authenticated
 */
const getCurrentUser = async request => {
  // TODO: 8.5 Implement getting current user based on the "Authorization" request header

  // NOTE: You can import two methods which can be useful here: // - getCredentials(request) function from utils/requestUtils.js
  // - getUser(email, password) function from utils/users.js to get the currently logged in user

  const userCredentials = getCredentials(request);
  if(!userCredentials){
    return null;
  }

  const currentUser = await User.findOne({email: userCredentials[0]});
  

  if(!currentUser){
    return null;
  }
  if(await currentUser.checkPassword(userCredentials[1])){
    return currentUser;
  }

  return null;

  

};

module.exports = { getCurrentUser };