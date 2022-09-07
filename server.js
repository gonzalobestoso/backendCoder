const express = require("express");
const productsRouter = require("./routes/productRouter");
const cartRouter = require("./routes/cartRouter");

const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/carrito", cartRouter);
app.use("/api/productos", productsRouter.productsRouter);

const isAdmin = require("./routes/productRouter");

app.get("/", (req, res) => {
  res.json(isAdmin);
});

app.all("*", (req, res) => {
  res.status(400).json({
    error: -2,
    descripcion: `ruta ${req.url} método ${req.method} no implementada`,
  });
});

const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});
