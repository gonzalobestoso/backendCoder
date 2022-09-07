const fs = require("fs");

class Cart {
  constructor(name) {
    this.name = `./${name}.json`;
  }

  async getAll() {
    try {
      const data = await fs.promises.readFile(`./db/${this.name}`, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error == "ENOENT") {
        fs.writeFile(`./db/${this.name}`, "[]", (error) => {
          return false;
        });

        return JSON.parse("[]");
      } else {
        return false;
      }
    }
  }

  async save() {
    let object = {};
    try {
      const allCarts = await this.getAll();

      const sortedArray = allCarts.sort((a, b) => a.id - b.id);

      sortedArray.length == 0
        ? (object = { id: 1, ...object })
        : (object = {
            id: sortedArray[sortedArray.length - 1].id + 1,
            ...object,
          });

      object.timestamp = new Date();
      object.products = [];

      allCarts.push(object);
      await fs.promises.writeFile(
        `./db/${this.name}`,
        JSON.stringify(allCarts)
      );

      return object.id;
    } catch (error) {
      return false;
    }
  }

  async deleteCart(id) {
    const json = await this.getAll();
    const filterJson = json.filter((e) => e.id != id);

    try {
      if (json.length != filterJson.length) {
        await fs.promises.writeFile(
          `./db/${this.name}`,
          JSON.stringify(filterJson)
        );
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  async getProductsByCart(id) {
    const json = await this.getAll();
    const cartFound = json.find((e) => e.id == id);

    if (cartFound) {
      if (cartFound.products) {
        return cartFound.products;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async addToCart(id, object) {
    const json = await this.getAll();
    const cart = json.find((e) => e.id == id);

    if (cart) {
      try {
        cart.products.push(object);

        await fs.promises.writeFile(`./db/${this.name}`, JSON.stringify(json));
        return true;
      } catch (error) {
        return false;
      }
    } else {
      return false;
    }
  }

  async deleteProductOnCart(cartId, productId) {
    const json = await this.getAll();
    const cart = json.find((e) => e.id == cartId);

    const largo = cart.products.length;
    cart.products = cart.products.filter((p) => p.id != productId);

    try {
      if (largo != cart.products.length) {
        await fs.promises.writeFile(`./db/${this.name}`, JSON.stringify(json));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}

module.exports = Cart;