const express = require("express");
const app = express();
const fs = require("fs");
app.use(express.json());

//filter by category
app.get("/product/:category", (req, res) => {
  fs.readFile("product.json", "utf8", (err, products) => {
    const productArr = JSON.parse(products);
    const { category } = req.params;
    if (category) {
      const categoryProduct = productArr.filter((item) => {
        return item.category === category;
      });
      res.send(categoryProduct);
    } else {
      res.send("non category");
    }
  });
});

//filter by id
app.get("/product/:id", (req, res) => {
  fs.readFile("product.json", "utf8", (err, products) => {
    const productArr = JSON.parse(products);
    const product = productArr.find((item) => item.id === +req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404);
      res.send();
    }
  });
});

//filter by title search
app.get("/product", (req, res) => {
  const { title } = req.query;
  fs.readFile("product.json", "utf8", (err, products) => {
    const productArr = JSON.parse(products);
    if (title) {
      const updateArr = productArr.filter((item) => item.title.includes(title));
      res.send(updateArr ? updateArr : "no data");
    } else {
      res.send(products);
    }
  });
});

//add new product
app.post("/product", (req, res) => {
  fs.readFile("product.json", "utf8", (err, products) => {
    const productArr = JSON.parse(products);
    productArr.push({
      id: productArr.length + 1,
      title: req.body.title,
      price: 109.95,
      description: "blabla",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    });

    fs.writeFile("product.json", JSON.stringify(productArr), (err) => {
      console.log(err);
      res.send("yes");
    });
  });
});

//update product
app.put("/product/:id", (req, res) => {
  fs.readFile("product.json", "utf8", (err, products) => {
    const productArr = JSON.parse(products);
    const { id } = req.params;
    const { title, price, category, description, image } = req.body;
    const updateArr = productArr.map((item) => {
      return item.id === +id
        ? {
            ...item,
            title,
            price: price ? price : item.price,
          }
        : item;
    });
    fs.writeFile("product.json", JSON.stringify(updateArr), (err) => {
      console.log(err);
      res.send("yes");
    });
  });
});

//dalete product
app.delete("/product/:id", (req, res) => {
  fs.readFile("product.json", "utf8", (err, products) => {
    const productArr = JSON.parse(products);

    const updateArr = productArr.filter((item) => item.id !== +req.params.id);
    fs.writeFile("product.json", JSON.stringify(updateArr), (err) => {
      console.log(err);
      res.send("yes");
    });
  });
});

app.listen(8080);
