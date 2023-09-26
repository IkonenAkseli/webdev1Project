const addToCart = (productId, productName) => {
  // TODO 9.2
  // you can use addProductToCart(), available already from /public/js/utils.js
  // for showing a notification of the product's creation, /public/js/utils.js  includes createNotification() function
  console.log('Id is: ' + productId + ' name is: ' + productName);
  addProductToCart(productId);
  createNotification('Added ' + productName + ' to cart!', 'notifications-container');
};

const handleclick = (event) => {
  console.log(event.target);
  const prodId = event.target.id.split('-')[3];
  const prodName = document.getElementById('name-' + prodId).innerText;
  addToCart(prodId, prodName);
};

const handleDelete = async (event) => {
  const prodId = event.target.id.split('-')[1];
  event.target.parentElement.id = 'removeme';
  try {
    const prod = await deleteResource(`/api/products/${prodId}`);
    removeElement('products-container', `removeme`);
    
    return createNotification(`Deleted product ${prod.name}`, 'notifications-container');
  } catch (error) {
    console.error(error);
    return createNotification('Delete failed!', 'notifications-container', false);
  }
};

const refreshPage = async() => {
  let prodContainer = document.getElementById('products-container');
  let prodTemplate = document.getElementById('product-template');
  prodContainer.innerHTML = '';

  getJSON('http://localhost:3000/api/products').then(products => {
    //console.log(products);
    
    products.map((element) => {
      //element = products[index];
      const clone = prodTemplate.content.cloneNode(true);
      clone.querySelector('h3').textContent = element.name;
      clone.querySelector('h3').id = 'name-' + element._id;
      
      const descprice = clone.querySelectorAll('p');
      descprice[0].textContent = element.description;
      descprice[0].id = 'description-' + element._id;
      descprice[1].textContent = element.price;
      descprice[1].id = 'price-' + element._id;

      clone.querySelectorAll('button')[0].id = 'add-to-cart-' + element._id;
      clone.querySelectorAll('button')[0].addEventListener('click', handleclick);
      clone.querySelectorAll('button')[1].id = 'delete-' + element._id;
      clone.querySelectorAll('button')[1].addEventListener('click', handleDelete);
      clone.querySelectorAll('button')[2].id = 'modify-' + element._id;
      clone.querySelectorAll('button')[2].addEventListener('click', handleModify);
      prodContainer.appendChild(clone);
    });

    //for (const index in products){}

    
  })
};

const updateProduct = async (event) => {
  event.preventDefault();

  const form = event.target;
  const name = form.querySelector('#name-input').value;
  const price = form.querySelector('#price-input').value;
  const image = form.querySelector('#image-input').value;
  const description = form.querySelector('#description-input').value;
  const id = form.querySelector('h2').id;

  const newProductData = {}
  if(name){
    newProductData['name'] = name;
  }
  if(price){
    newProductData['price'] = parseFloat(price);
  }
  if(image){
    newProductData['image'] = image;
  }
  if(description){
    newProductData['description'] = description;
  }
  

  try {
    const product = await postOrPutJSON(`/api/products/${id}`, 'PUT',  newProductData );

    removeElement('modify-product', 'edit-product-form');
    refreshPage();
    return createNotification(`Updated product ${product.name}`, 'notifications-container');
    
    
  } catch (error) {
    console.error(error);
    return createNotification('Update failed!', 'notifications-container', false);
  }


};

const handleModify = async (event) => {
  const modifyContainer = document.getElementById('modify-product');
  removeElement('modify-product', 'edit-product-form');

    const form = document.getElementById('form-template').content.cloneNode(true);
    let id = event.target.id.split('-')[1];
    
    form.querySelector('h2').id = id;
    modifyContainer.append(form);
    modifyContainer.querySelector('form').addEventListener('submit', updateProduct);
};

(async() => {
  //TODO 9.2 
  // - get the 'products-container' element from the /products.html
  // - get the 'product-template' element from the /products.html
  // - save the response from await getJSON(url) to get all the products. getJSON(url) is available to this script in products.html, as "js/utils.js" script has been added to products.html before this script file 
  // - then, loop throug the products in the response, and for each of the products:
  //    * clone the template
  //    * add product information to the template clone
  //    * remember to add an event listener for the button's 'click' event, and call addToCart() in the event listener's callback
  // - remember to add the products to the the page
  

  refreshPage();


})();