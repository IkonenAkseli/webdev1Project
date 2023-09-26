const responseUtils = require('./utils/responseUtils');
const { acceptsJson, isJson, parseBodyJson } = require('./utils/requestUtils');
const { renderPublic } = require('./utils/render');

const { getCurrentUser } = require('./auth/auth');

const User = require('./models/user');
const { getAllUsers, viewUser, deleteUser, updateUser, registerUser, checkIfAdmin } = require('./controllers/users');
const { getAllProducts, getProductById, deleteProductById, updateProductById } = require('./controllers/products');
const { getAllOrders, getOrdersByUserId, createOrder, getOrderById } = require('./controllers/orders');

/**
 * Known API routes and their allowed methods
 *
 * Used to check allowed methods and also to send correct header value
 * in response to an OPTIONS request by sendOptions() (Access-Control-Allow-Methods)
 */
const allowedMethods = {
  '/api/register': ['POST'],
  '/api/users': ['GET'],
  '/api/products': ['GET'],
  '/api/cart': ['POST'],
  '/api/orders': ['GET', 'POST']
};

/**
 * Send response to client options request.
 *
 * @param {string} filePath pathname of the request URL
 * @param {http.ServerResponse} response a response
 */
const sendOptions = (filePath, response) => {
  if (filePath in allowedMethods) {
    response.writeHead(204, {
      'Access-Control-Allow-Methods': allowedMethods[filePath].join(','),
      'Access-Control-Allow-Headers': 'Content-Type,Accept',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Expose-Headers': 'Content-Type,Accept'
    });
    return response.end();
  }

  return responseUtils.notFound(response);
};

/**
 * Does the url have an ID component as its last part? (e.g. /api/users/dsf7844e)
 *
 * @param {string} url filePath
 * @param {string} prefix prefix
 * @returns {boolean} what to do
 */
const matchIdRoute = (url, prefix) => {
  const idPattern = '[0-9a-z]{8,24}';
  const regex = new RegExp(`^(/api)?/${prefix}/${idPattern}$`);
  return regex.test(url);
};

/**
 * Does the URL match /api/users/{id}
 *
 * @param {string} url filePath
 * @returns {boolean} what to do
 */
const matchUserId = url => {
  return matchIdRoute(url, 'users');
};





const handleRequest = async(request, response) => {
  const { url, method, headers } = request;
  const filePath = new URL(url, `http://${headers.host}`).pathname;

  // serve static files from public/ and return immediately
  if (method.toUpperCase() === 'GET' && !filePath.startsWith('/api')) {
    const fileName = filePath === '/' || filePath === '' ? 'index.html' : filePath;
    return renderPublic(fileName, response);
  }
  
  const splitPath = filePath.split('/');

  try {
    
    if(splitPath[1] === 'api' && splitPath[2] === 'products'){
      const user = await getCurrentUser(request);
      if(!user){
        return responseUtils.basicAuthChallenge(response);
      }
      if (!acceptsJson(request)) {
        return responseUtils.contentTypeNotAcceptable(response);
      }
      if(method.toUpperCase() === 'GET' && splitPath.length === 3){
        if (!acceptsJson(request)) {
          return responseUtils.contentTypeNotAcceptable(response);
        }
        try {
          if((!headers.accept.includes('application/json') && !headers.accept.includes('*/*'))){
            return responseUtils.contentTypeNotAcceptable(response);
          }
        }
        catch (error){
          console.log(error);
        }
        
        return getAllProducts(response);
      }
      else if(method.toUpperCase() === 'GET'){
        const user = await getCurrentUser(request);
      if(!user){
        return responseUtils.basicAuthChallenge(response);
      }
      if (!acceptsJson(request)) {
        return responseUtils.contentTypeNotAcceptable(response);
      }
        
        return getProductById(response, splitPath[3]);
      }
      // Check if admin
      if(user.role !== 'admin'){
        return responseUtils.forbidden(response);
      }
      if(method.toUpperCase() === 'DELETE' && splitPath.length === 4){
        
        return deleteProductById(response, splitPath[3]);
      }
      if(method.toUpperCase() === 'PUT' && splitPath.length === 4){
        if (!isJson(request)) {
          return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
        }
        
    
        const reqParsed = await parseBodyJson(request);

        return updateProductById(response, splitPath[3], reqParsed);
      }
    }

    
  } catch (error) {
    console.log(error);
  }


  try {
    
    if(splitPath[1] === 'api' && splitPath[2] === 'orders'){
      const user = await getCurrentUser(request);
      if(!user){
        return responseUtils.basicAuthChallenge(response);
      }
      if (!acceptsJson(request)) {
        return responseUtils.contentTypeNotAcceptable(response);
      }
      

      if(method.toUpperCase() === 'GET' && splitPath.length === 3){
        
        //console.log("hei");
      
        
        if(user.role !== 'admin'){
          return getOrdersByUserId(response, user._id);
        }
        return getAllOrders(response);
      }
      else if (method.toUpperCase() === 'GET'){
        if(user.role !== 'admin'){
          return responseUtils.forbidden(response);
        }
        return getOrderById(response, splitPath[3]);
      }
    
      if(method.toUpperCase() === 'POST'){
        
        if(!user){
          return responseUtils.basicAuthChallenge(response);
        }
        if(user.role === 'admin'){
          return responseUtils.forbidden(response);
        }
        if (!isJson(request)) {
          return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
        }
        const reqParsed = await parseBodyJson(request);
    
        return createOrder(reqParsed, response, user._id);
      }
    }
  } catch (error) {
    console.log(error);
  }

  

  if (matchUserId(filePath)) {
    // TODO: 8.6 Implement view, update and delete a single user by ID (GET, PUT, DELETE)
    // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body
    // If the HTTP method of a request is OPTIONS you can use sendOptions(filePath, response) function from this module
    // If there is no currently logged in user, you can use basicAuthChallenge(response) from /utils/responseUtils.js to ask for credentials
    //  If the current user's role is not admin you can use forbidden(response) from /utils/responseUtils.js to send a reply
    // Useful methods here include:
    // - getUserById(userId) from /utils/users.js
    // - notFound(response) from  /utils/responseUtils.js 
    // - sendJson(response,  payload)  from  /utils/responseUtils.js can be used to send the requested data in JSON format

    const user = await getCurrentUser(request);
    if(!user){
      return responseUtils.basicAuthChallenge(response);
    }
    

    if(user.role === 'customer'){
      return responseUtils.forbidden(response);
    }
    if(user.role !== 'admin'){
      return responseUtils.badRequest(response, 'blah');
    }

    if (method.toUpperCase() === 'OPTIONS') return sendOptions(filePath, response);

    if (!acceptsJson(request)) {
      return responseUtils.contentTypeNotAcceptable(response);
    }
    
    const idToBeHandled = filePath.split('/')[3];

    if(method.toUpperCase() === 'GET'){
      return viewUser(response, idToBeHandled, user);
    }

    if(method.toUpperCase() === 'DELETE'){
      return deleteUser(response, idToBeHandled, user);
    }

    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }
    

    const reqParsed = await parseBodyJson(request);
    
    if(method.toUpperCase() === 'PUT'){
      const checker = checkIfAdmin(user);
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
      if(!reqParsed.role){
        return responseUtils.badRequest(response, 'Bad Request');
      }
      if(reqParsed.role !== 'admin' && reqParsed.role !== 'customer'){

        return responseUtils.badRequest(response, 'Bad Request');
      }
      if(!(reqParsed.role === 'customer' || reqParsed.role === 'admin')){
        return responseUtils.badRequest(response, 'Bad Request');
      }
      return updateUser(response, idToBeHandled, user, reqParsed);
    }
    
    

  }
  
  // Default to 404 Not Found if unknown url
  if (!(filePath in allowedMethods)) return responseUtils.notFound(response);
  
  // See: http://restcookbook.com/HTTP%20Methods/options/
  if (method.toUpperCase() === 'OPTIONS') return sendOptions(filePath, response);

  // Check for allowable methods
  if (!allowedMethods[filePath].includes(method.toUpperCase())) {
    return responseUtils.methodNotAllowed(response);
  }
  
  // Require a correct accept header (require 'application/json' or '*/*')
  if (!acceptsJson(request)) {
    return responseUtils.contentTypeNotAcceptable(response);
  }
  

  // GET all users
  if (filePath === '/api/users' && method.toUpperCase() === 'GET') {
    const user = await getCurrentUser(request);
    //console.log(user);
    if(!user){
      return responseUtils.basicAuthChallenge(response);
    }
    
    if(user.role !== 'admin'){
      return responseUtils.forbidden(response);
    }
    return getAllUsers(response);
  }

  // register new user
  if (filePath === '/api/register' && method.toUpperCase() === 'POST') {
    // Fail if not a JSON request, don't allow non-JSON Content-Type
    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }

    // TODO: 8.4 Implement registration
    // You can use parseBodyJson(request) method from utils/requestUtils.js to parse request body.
    // Useful methods here include:
    // - validateUser(user) from /utils/users.js 
    // - emailInUse(user.email) from /utils/users.js
    // - badRequest(response, message) from /utils/responseUtils.js
    

    const reqParsed = await parseBodyJson(request);
    return registerUser(response, reqParsed);

    
    
  }

  
  

  

};

module.exports = { handleRequest };