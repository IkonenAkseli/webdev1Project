const { getCurrentUser } = require("../auth/auth");
const User = require("../models/user");
const { isJson } = require("../utils/requestUtils");
const responseUtils = require('../utils/responseUtils');

/**
 * Send all users as JSON
 *
 * @param {http.ServerResponse} response a response
 */
const getAllUsers = async (response) => {
  // TODO: 10.2 Implement this
  

  return responseUtils.sendJson(response, await User.find({}));
};

const checkIfAdmin = (user) => {
  
  if(!user){
    return 0;
  }
  

  if(user.role === 'customer'){
    return 1;
  }
  if(user.role !== 'admin'){
    return 2;
  }
  return 3;
};

/**
 * Delete user and send deleted user as JSON
 *
 * @param {http.ServerResponse} response a response
 * @param {string} userId id
 * @param {object} currentUser (mongoose document object)
 */
const deleteUser = async(response, userId, currentUser) => {
  // TODO: 10.2 Implement this
  const checker = checkIfAdmin(currentUser);
  switch (checker) {
    case 0:
      return responseUtils.basicAuthChallenge(response);
    case 1:
      return responseUtils.forbidden(response);
    case 2:
      return responseUtils.badRequest(response, 'blah');
    default:
      break;
  }

  const isEqual = currentUser._id.equals(userId);

  if(isEqual){

    return responseUtils.badRequest(response, 'Cannot delete self');
    
  }
  else {

    const userToBeHandled = await User.findById(userId).exec();

    

    //console.log(JSON.stringify(userToBeHandled));
      
    if(!userToBeHandled){ 
      return responseUtils.notFound(response);
    }
    await User.deleteOne({_id: userId});
    
    return responseUtils.sendJson(response, userToBeHandled);
  }
  
};

/**
 * Update user and send updated user as JSON
 *
 * @param {http.ServerResponse} response a response
 * @param {string} userId id
 * @param {object} currentUser (mongoose document object)
 * @param {object} userData JSON data from request body
 * @return a response
 */
const updateUser = async(response, userId, currentUser, userData) => {
  // TODO: 10.2 Implement this
  
  const isEqual = currentUser._id.equals(userId);
  if(isEqual){
    return responseUtils.badRequest(response, 'Updating own data is not allowed');
  }
  const userToBeHandled = await User.findById(userId).exec();
    
  if(!userToBeHandled){ 
    return responseUtils.notFound(response);
  }

  if(!userData.role || (userData.role !== 'admin' && userData.role !== 'customer')){
    return responseUtils.badRequest(response, 'Bad Request');
  }

  

  userToBeHandled.role = userData.role;
  await userToBeHandled.save();
  return responseUtils.sendJson(response, userToBeHandled);
};

/**
 * Send user data as JSON
 *
 * @param {http.ServerResponse} response a response
 * @param {string} userId id
 * @param {object} currentUser (mongoose document object)
 */
const viewUser = async(response, userId, currentUser) => {
  // TODO: 10.2 Implement this
  const checker = checkIfAdmin(currentUser);
  switch (checker) {
    case 0:
      return responseUtils.basicAuthChallenge(response);
    case 1:
      return responseUtils.forbidden(response);
    case 2:
      return responseUtils.badRequest(response, 'blah');
    default:
      break;
  }
  const userToBeHandled = await User.findById(userId).exec();
    
  if(!userToBeHandled){ 
    return responseUtils.notFound(response);
  }

  
  return responseUtils.sendJson(response, userToBeHandled);
  
  
};

/**
 * Register new user and send created user back as JSON
 *
 * @param {http.ServerResponse} response a response
 * @param {object} userData JSON data from request body
 */
const registerUser = async(response, userData) => {
  // TODO: 10.2 Implement this
  
  

    const newUserData = {
      name: userData.name,
      email: userData.email,
      password: userData.password
    };
    if(!userData.password){
      return responseUtils.badRequest(response, 'Password must be at least 10 characters long.');
    }
    if(userData.password.length < 10){
      return responseUtils.badRequest(response, 'Password must be at least 10 characters long.');
    }

    const createdUser = new User(newUserData);

    if(await createdUser.validateSync()){
      return responseUtils.badRequest(response, 'Something is wrong :O!');
    }

    if(await User.findOne({email: newUserData.email}).exec()){
      return responseUtils.badRequest(response, 'Email already in use');
    }

    await createdUser.save();

    userData.role = 'customer';

    return responseUtils.createdResource(response, await User.findOne({email: newUserData.email}));
};

module.exports = { getAllUsers, registerUser, deleteUser, viewUser, updateUser, checkIfAdmin };