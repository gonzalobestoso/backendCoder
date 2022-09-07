const Product = require("../products");

const express = require("express");
const { Router } = express;

const productsRouter = Router();

const product = new Product("products");
const isAdmin = true;

productsRouter.get("/", (req, res) => {
  product.getAll().then((products) => {
    res.json(products);
  });
});

productsRouter.get("/:id", (req, res) => {
  const { id } = req.params;

  product.getById(id).then((response) => {
    response
      ? res.json(response)
      : res
          .status(400)
          .json({ error: `No se encontró el producto con el id ${id}` });
  });
});

const checkAdmin = (req, res, next) => {
  if (!isAdmin) {
    return res.status(403).send({ error: "Acceso no autorizado" });
  } else {
    return next();
  }
};

productsRouter.post("/", checkAdmin, (req, res) => {
  let timestamp = Date.now();
  let name = req.body.name;
  let description = req.body.description;
  let code = req.body.code;
  let thumbnail = req.body.thumbnail;
  let price = parseFloat(req.body.price);
  let stock = parseInt(req.body.stock);

  const productToSave = {
    timestamp,
    name,
    description,
    code,
    thumbnail,
    price,
    stock,
  };

  product.save(productToSave).then((response) => {
    res.json({ result: response });
  });
});

productsRouter.put("/:id", checkAdmin, (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const { name, description, code, thumbnail, price, stock } = body;

  const productToSave = { id, name, description, code, thumbnail, price, stock };

  product.update(productToSave).then((response) => {
    res.json({ result: response });
  });
});

productsRouter.delete("/:id", checkAdmin, (req, res) => {
  const { id } = req.params;

  product.delete(id).then((response) => {
    res.json({ result: response });
  });
});

module.exports = { productsRouter, isAdmin };
