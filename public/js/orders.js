
addEventListener('submit', async (e) => {

    e.preventDefault();
    const searchTerm = document.getElementById('searchbar').value;
    if(document.getElementById('searchbar').value.length === 0){
        resetPage();
        document.getElementById('searchbar').value = "";
        return;
    }

    getJSON('/api/orders/' + searchTerm).then(ord => {
        console.log(ord);
        let orderContainer = document.getElementById('orders-container');

        orderContainer.innerHTML = "";

        let prodTemplate = document.getElementById('product-template');
        let orderTemplate = document.getElementById('order-template');

        const orderClone = orderTemplate.content.cloneNode(true);
        orderClone.querySelector("h2").innerText = ord._id;
        let productContainer = orderClone.querySelector(".order-products");

        ord.items.map((element) => {
        
            
            const clone = prodTemplate.content.cloneNode(true);
        
            clone.querySelector('h3').textContent = element.product.name;
            clone.querySelector('h3').id = 'name-' + element.product._id;
            
            const descprice = clone.querySelectorAll('p');
            descprice[0].textContent = element.product.description;
            descprice[0].id = 'description-' + element.product._id;
            descprice[1].textContent = element.product.price;
            descprice[1].id = 'price-' + element.product._id;
            descprice[2].textContent = 'Amount: ' + element.quantity;
            productContainer.appendChild(clone);
        });
        //element = products[index];
    
    
    orderContainer.appendChild(orderClone);
    });

    document.getElementById('searchbar').value = "";
});

const resetPage = async () => {
    let orderContainer = document.getElementById('orders-container');
    let prodTemplate = document.getElementById('product-template');
    let orderTemplate = document.getElementById('order-template');

    orderContainer.innerHTML = "";

    getJSON('/api/orders').then(orders => {
      //console.log(products);
      
      orders.forEach(async (ord) => {
        //console.log(ord);
        const orderClone = orderTemplate.content.cloneNode(true);
        orderClone.querySelector("h2").innerText = ord._id;
        let productContainer = orderClone.querySelector(".order-products");

        await Promise.all(ord.items.map((element) => {
        
            
            const clone = prodTemplate.content.cloneNode(true);
        
            clone.querySelector('h3').textContent = element.product.name;
            clone.querySelector('h3').id = 'name-' + element.product._id;
            
            const descprice = clone.querySelectorAll('p');
            descprice[0].textContent = element.product.description;
            descprice[0].id = 'description-' + element.product._id;
            descprice[1].textContent = element.product.price;
            descprice[1].id = 'price-' + element.product._id;
            descprice[2].textContent = 'Amount: ' + element.quantity;
            productContainer.appendChild(clone);
        }));
        //element = products[index];
        
        
        orderContainer.appendChild(orderClone);
      });
  
      //for (const index in products){}
  
      
    })
}



(async() => {
    resetPage();
  })();