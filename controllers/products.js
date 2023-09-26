const { getCurrentUser } = require("../auth/auth");
const Product = require("../models/product");

const { getAllProductsFromJson } = require("../utils/products");
const responseUtils = require('../utils/responseUtils');

/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response a response
 */
const getAllProducts = async (response) => {

  return await responseUtils.sendJson(response, await Product.find({}));
};
/**
 * 
 * @param {http.ServerResponse} response a response
 * @param {string} prodId id
 * @returns a response
 */
const getProductById = async (response, prodId) => {
  const prod = await Product.findById(prodId);
  if(!prod){
    return responseUtils.notFound(response);
  }
  return responseUtils.sendJson(response, prod);
};
/**
 * 
 * @param {http.ServerResponse} response a response
 * @param {string} prodId id
 * @returns a response
 */
const deleteProductById = async (response, prodId) => {
  const productToBeHandled = await Product.findById(prodId).exec();

    

  //console.log(JSON.stringify(userToBeHandled));
    
  if(!productToBeHandled){ 
    return responseUtils.notFound(response);
  }
  await Product.deleteOne({_id: prodId});
  
  return responseUtils.sendJson(response, productToBeHandled);
};
/**
 * 
 * @param {http.ServerResponse} response a response
 * @param {string} prodId id
 * @param {object} newProdData new data
 * @returns a response
 */
const updateProductById = async (response, prodId, newProdData) => {
  const productToBeHandled = await Product.findById(prodId).exec();

  console.log(productToBeHandled);

  if(!productToBeHandled){ 
    return responseUtils.notFound(response);
  }
  console.log(newProdData);

  Object.entries(newProdData).forEach(entry => {
    
    const [key, value] = entry;
    if((key === 'name' && !value) || (key === 'price' && !value )){
      //console.log("Hello from first if")
      return responseUtils.badRequest(response, 'nono');
      
    }
    else if (key === 'name'){
      productToBeHandled.name = value;
    }
    if(key === 'price' && value){
      if(typeof(value) !== 'number'){
        //console.log("Hello from second if")
        return responseUtils.badRequest(response, 'nono');
      }
      else if (value <= 0){
        //console.log("Hello from third if")
        return responseUtils.badRequest(response, 'nono');
      }
      productToBeHandled.price = value;
    }
    if (key === 'description'){
      productToBeHandled.description = value;
    }
    if (key === 'image'){
      productToBeHandled.image = value;
    }
    
    //console.log(productToBeHandled.value);
  });

  //console.log(productToBeHandled);  

  await productToBeHandled.save();
  
  return responseUtils.sendJson(response, productToBeHandled);
};

module.exports = { getAllProducts, getProductById, deleteProductById, updateProductById };