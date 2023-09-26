const Order = require("../models/order");
const Product = require("../models/product");
const responseUtils = require('../utils/responseUtils');

/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response a response
 * 
 */
 const getAllOrders = async (response) => {

    return responseUtils.sendJson(response, await Order.find({}));
 };
/**
 * 
 * @param {http.ServerResponse} response a response
 * @param {string} orderId order id
 * @returns response
 */
 const getOrderById = async (response, orderId) => {
    const order = await Order.findById(orderId);
    return responseUtils.sendJson(response, order);
 };

 /**
  * 
  * @param {http.ServerResponse} response a response
  * @param {string} userId user id
  * @returns a response
  */
 const getOrdersByUserId = async (response, userId) => {
    const orders = await Order.find({customerId: userId});
    return responseUtils.sendJson(response, orders);
 };

 /**
  * 
  * @param {JSON object} reqParsed an object
  * @param {http.ServerResponse} response a response
  * @param {string} userId user id
  * @returns a response
  */
 const createOrder = async (reqParsed, response, userId) => {
    const itemData = [];
    //console.log(reqParsed);
    await Promise.all(reqParsed.map(async (orderItem) => {
        const prodData = await Product.findById(orderItem.id);
        //console.log(prodData)
        const tempData = {
            product: {
                _id: orderItem.id,
                name: prodData.name,
                price: prodData.price,
                description: prodData.description
            },
            quantity: orderItem.quantity
        };
        //console.log(tempData);
        itemData.push(tempData);
    }));
    
    const newOrderData = {
        customerId : userId,
        items : itemData
    };

    const createdOrder = new Order(newOrderData);
    await createdOrder.save();

    return responseUtils.createdResource(response, createdOrder);
 };
  
  module.exports = { getAllOrders, getOrdersByUserId, createOrder, getOrderById };