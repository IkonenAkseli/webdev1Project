/**
 * Object to store products.
 */
const data = {
    // make copies of products
    products: require('../products.json').map(product => ({...product }))
  };


/**
 * Return all products
 *
 * Returns copies of the products and not the originals
 * to prevent modifying them outside of this module.
 *
 * @returns {Array<object>} all products
 */
const getAllProductsFromJson = () => data.products.map(product => ({...product }));





module.exports = {
    getAllProductsFromJson
  };