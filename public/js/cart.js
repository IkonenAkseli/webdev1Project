const addToCart = productId => {
  // TODO 9.2
  // use addProductToCart(), available already from /public/js/utils.js
  // call updateProductAmount(productId) from this file
};

const decreaseCount = productId => {
  // TODO 9.2
  // Decrease the amount of products in the cart, /public/js/utils.js provides decreaseProductCount()
  // Remove product from cart if amount is 0,  /public/js/utils.js provides removeElement = (containerId, elementId

};

const updateProductAmount = productId => {
  // TODO 9.2
  // - read the amount of products in the cart, /public/js/utils.js provides getProductCountFromCart(productId)
  // - change the amount of products shown in the right element's innerText

};

const placeOrder = async() => {
  // TODO 9.2
  // Get all products from the cart, /public/js/utils.js provides getAllProductsFromCart()
  // show the user a notification: /public/js/utils.js provides createNotification = (message, containerId, isSuccess = true)
  // for each of the products in the cart remove them, /public/js/utils.js provides removeElement(containerId, elementId)
  const products = getAllProductsFromCart();
  console.log(products);

  let orderData = [];

  products.forEach((product) => {
    const productId = product.id;
    const productQuantity = product.amount;
    orderData.push({id: productId, quantity: productQuantity});
    removeElement('cart-container', 'container' + productId);
  })
  postOrPutJSON('/api/orders', 'POST', orderData);

  // for(const index in products){
  //   const productId = products[index].id;
  //   console.log(productId);
  //   removeElement('cart-container', 'container' + productId);
  // }
  sessionStorage.clear();
  createNotification('Cart cleared!', 'notifications-container');

};

const handlePlusBtn = (event) => {
  const newCount = addProductToCart(event.target.id.split('-')[1]);
  
  event.target.parentElement.querySelectorAll('p')[1].innerText = newCount + 'x';
  createNotification('Added to cart!', 'notifications-container');
};

const handleMinusBtn = (event) => {
  const newCount = decreaseProductCount(event.target.id.split('-')[1]);
  if(newCount === 0){
    
    
    removeElement('cart-container', event.target.parentElement.id);
  }
  else {
    event.target.parentElement.querySelectorAll('p')[1].innerText = newCount + 'x';
  }
  
  
  createNotification('Removed from cart!', 'notifications-container');
};

(async() => {
  // TODO 9.2
  // - get the 'cart-container' element
  // - use getJSON(url) to get the available products
  // - get all products from cart
  // - get the 'cart-item-template' template
  // - for each item in the cart
  //    * copy the item information to the template
  //    * hint: add the product's ID to the created element's as its ID to 
  //        enable editing ith 
  //    * remember to add event listeners for cart-minus-plus-button
  //        cart-minus-plus-button elements. querySelectorAll() can be used 
  //        to select all elements with each of those classes, then its 
  //        just up to finding the right index.  querySelectorAll() can be 
  //        used on the clone of "product in the cart" template to get its two
  //        elements with the "cart-minus-plus-button" class. Of the resulting
  //        element array, one item could be given the ID of 
  //        `plus-${product_id`, and other `minus-${product_id}`. At the same
  //        time we can attach the event listeners to these elements. Something 
  //        like the following will likely work:
  //          clone.querySelector('button').id = `add-to-cart-${prodouctId}`;
  //          clone.querySelector('button').addEventListener('click', () => addToCart(productId, productName));
  //
  // - in the end remember to append the modified cart item to the cart

  document.getElementById('place-order-button').addEventListener('click', placeOrder);

  const products = await getJSON('http://localhost:3000/api/products');
  let items = getAllProductsFromCart();
  console.log(items);

  const template = document.getElementById('cart-item-template');
  const cartContainer = document.getElementById('cart-container');

  items.map((currentId, index) => {
    console.log(currentId + ' ' + index);
    let item = products.filter(obj => { return obj._id === items[index].id})[0];
    item.amount = items[index].amount;
    const clone = template.content.cloneNode(true);
    console.log(item);
    clone.querySelector('h3').parentElement.id = 'container' + item._id;
    
    clone.querySelector('h3').textContent = item.name;
    clone.querySelector('h3').id = 'name-' + item._id;
    
    const priceAmount = clone.querySelectorAll('p');
    priceAmount[0].textContent = item.price;
    priceAmount[0].id = 'price-' + item._id;
    priceAmount[1].textContent = item.amount + 'x';
    priceAmount[1].id = 'amount-' + item._id;

    const buttons = clone.querySelectorAll('button');
    buttons[0].id = 'plus-' + item._id;
    buttons[1].id = 'minus-' + item._id;

    buttons[0].addEventListener('click', handlePlusBtn);
    buttons[1].addEventListener('click', handleMinusBtn);
    
    cartContainer.appendChild(clone);
  });

  //for (const index in items){}

})();