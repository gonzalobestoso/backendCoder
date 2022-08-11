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
app.use('/api/products', router);

//array de productos
let productsHC = [
{id:1, name: 'nike', price:100, thumbnail:'http://localhost:8080/public/nike.png'}, 
{id:2, name:'adidas', price:200, thumbnail:'http://localhost:8080/public/adidas.png'}, 
{id:3, name:'puma', price:300, thumbnail:'http://localhost:8080/public/puma.png'}
];

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

router.get('/', (req, res) => {
  const products = new Products(productsHC);
  res.json(products.getAll());

  });

router.get('/form', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

router.get('/:id', (req, res) => {
    let { id } = req.params;
    const products = new Products(productsHC);
    id = parseInt(id);
    const found  = products.findOne(id);
    if (found) {
      res.json(found);
    } else {
      res.json({error: 'producton no encontrado'});
    }

});
  
  
router.post('/', (req, res) => {
    const { body } = req;
    body.price = parseFloat(body.price);
    const products = new Products(productsHC);
    const createdProduct = products.addOne(body);
    res.json({sucess: "ok", new: createdProduct});
    
});
  
  
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const products = new Products(productsHC);
    const productToChange = products.updateOne(id, body);
    if (productToChange){
      res.json({sucess: "ok", new: productToChange})
    }else{
      res.json({error: 'producton no encontrado'});
    }
   
});
  
  
router.delete('/:id', (req, res) => {
    let { id } = req.params; 
    const products = new Products(productsHC);
    id = parseInt(id);
    const productToDelete = products.deleteOne(id);
    if(productToDelete != undefined){
      res.json({success:"ok", id}) 
    } else {
      res.json({error: 'producton no encontrado'});
    }
});
