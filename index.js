const express = require("express");
const { Router } = express;

const app = express();
const router = Router();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {console.log(`Servidor http escuchando en el puerto ${server.address().port}`);});
server.on('error', (error)=> console.log(`Error en servidor: ${error}`));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/public', express.static(__dirname + '/public'));


//middleware
app.use((req, res, next) =>{
  console.log("acaba de llegar una request");
  next();
  
})

//router
app.use('/api', router);




//array de productos
let productsHC = [
{id:1, name: 'nike', price:100, thumbnail:'http://localhost:8080/public/nike.png', timestamp: Date.now(), description: 'zapatilla nike', codigo: 'aaa111', stock: 25 }, 
{id:2, name:'adidas', price:200, thumbnail:'http://localhost:8080/public/adidas.png', timestamp: Date.now(), description: 'zapatilla adidas', codigo: 'aaa222', stock: 20 }, 
{id:3, name:'puma', price:300, thumbnail:'http://localhost:8080/public/puma.png', timestamp: Date.now(), description: 'zapatilla puma', codigo: 'aaa333', stock: 15 }
];

let carritoHC = [{id:1, timestamp: Date.now(), products: productsHC }];

class Products {
  constructor(products) {
    this.products = [... products];
  }
  
  findOne(id){
    return this.products.find((item) => item.id == id);
  }

  addOne(product){
    const lastItem = this.products[this.products.length - 1];
    let lastId = 1;
    if (lastItem){
      lastId = lastItem.id + 1;
    }

    product.id = lastId;
    this.products.push(product);
    return this.products[this.products.length -1];
  }

  updateOne(id, product){
    const productToInsert = {...product, id};
    for(let i = 0; i< this.products.length; i++){
      if(this.products[i].id == id){
        this.products[i] = productToInsert;
        return productToInsert;
      }
    }

    return undefined;
  }

  deleteOne(id){
    const foundProduct = this.findOne(id);
    if (foundProduct){
      this.products = this.products.filter((item) => item.id != id);
      return id;
    }
    return undefined;
  }

  getAll(){
    return this.products;
  }
}

class Cart {
  constructor(carts) {
    this.carts = [... carts];
  }
  
  findOne(id){
    return this.carts.find((item) => item.id == id);
  }

  addOne(cart){
    const lastItem = this.carts[this.carts.length - 1];
    let lastId = 1;
    if (lastItem){
      lastId = lastItem.id + 1;
    }

    cart.id = lastId;
    this.carts.push(cart);
    return this.carts[this.carts.length -1];
  }

  updateOne(id, cart){
    const cartToInsert = {...cart, id};
    for(let i = 0; i< this.carts.length; i++){
      if(this.carts[i].id == id){
        this.carts[i] = cartToInsert;
        return cartToInsert;
      }
    }

    return undefined;
  }

  deleteOne(id){
    const foundCart = this.findOne(id);
    if (foundCart){
      this.carts = this.carts.filter((item) => item.id != id);
      return id;
    }
    return undefined;
  }

  getAll(){
    return this.carts;
  }
}



router.get('/products', (req, res) => {
  const products = new Products(productsHC);
  res.json(products.getAll());

  });

router.get('/products/form', (req, res) => {
  res.sendFile(__dirname + '/formProductos.html');
});

router.get('/products/:id', (req, res) => {
    let { id } = req.params;
    const products = new Products(productsHC);
    id = parseInt(id);
    const found  = products.findOne(id);
    if (found) {
      res.json(found);
    } else {
      res.json({error: 'producto no encontrado'});
    }

});
  
  
router.post('/products', (req, res) => {
    const { body } = req;
    body.price = parseFloat(body.price);
    const products = new Products(productsHC);
    const createdProduct = products.addOne(body);
    res.json({sucess: "ok", new: createdProduct});
    
});
  
  
router.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const products = new Products(productsHC);
    const productToChange = products.updateOne(id, body);
    if (productToChange){
      res.json({sucess: "ok", new: productToChange})
    }else{
      res.json({error: 'producto no encontrado'});
    }
   
});
  
  
router.delete('/products/:id', (req, res) => {
    let { id } = req.params; 
    const products = new Products(productsHC);
    id = parseInt(id);
    const productToDelete = products.deleteOne(id);
    if(productToDelete != undefined){
      res.json({success:"ok", id}) 
    } else {
      res.json({error: 'producto no encontrado'});
    }
});


router.get('/cart', (req, res) => {
  const carrito = new Cart(carritoHC);
  res.json(carrito.getAll());

  });

router.get('/cart/form', (req, res) => {
  res.sendFile(__dirname + '/carrito.html');
});

router.get('/cart/:id', (req, res) => {
    let { id } = req.params;
    const carrito = new Cart(carritoHC);
    id = parseInt(id);
    const found  = carrito.findOne(id);
    if (found) {
      res.json(found);
    } else {
      res.json({error: 'producto en carrito no encontrado'});
    }

});  
  
router.post('/cart', (req, res) => {
    const { body } = req;
    const carrito = new Cart(carritoHC);
    const createdCarrito = carrito.addOne(body);
    res.json({sucess: "ok", new: createdCarrito});
    
});
  
  
router.put('/cart/:id', (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const carrito = new Cart(carritoHC);
    const cartToChange = carrito.updateOne(id, body);
    if (cartToChange){
      res.json({sucess: "ok", new: cartToChange})
    }else{
      res.json({error: 'producto en carritono encontrado'});
    }
   
});
  
  
router.delete('/cart/:id', (req, res) => {
    let { id } = req.params; 
    const carrito = new Cart(carritoHC);
    id = parseInt(id);
    const carritoToDelete = carrito.deleteOne(id);
    if(carritoToDelete != undefined){
      res.json({success:"ok", id}) 
    } else {
      res.json({error: 'producto en carrito no encontrado'});
    }
});
