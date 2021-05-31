const express = require("express");
const app = express();
const fs = require("fs");
app.use(express.json());

function readProduct(callback) {
  fs.readFile("product.json", "utf8", (err, products) => {
    console.log(err);
    const productArr = JSON.parse(products);
    callback(productArr);
  });
}

function writeProduct(products) {
  fs.writeFile("product.json", JSON.stringify(products), (err) => {
    console.log(err);
  });
}

//filter by id
app.get("/product/:id", (req, res) => {
  readProduct((products) => {
    const product = products.find((item) => item.id === +req.params.id);
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
  readProduct((products) => {
    const { q } = req.query;
    if (q) {
      let updateArr = products.filter(
        (item) => item.title.includes(q) || item.description.includes(q)
      );
      res.send(updateArr ? updateArr : "no data");
    } else {
      res.send(products);
    }
  });
});

//add new product
app.post("/product", (req, res) => {
  readProduct((products) => {
    products.push({
      id: products.length + 1,
      title: req.body.title,
      price: 109.95,
      description: "blabla",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    });
    writeProduct(products);
    res.send("success");
  });
});

//update product
app.put("/product/:id", (req, res) => {
  const { id } = req.params;
  const { title, price, category, description, image } = req.body;
  readProduct((products) => {
    const updateArr = products.map((item) =>
      item.id === +id
        ? {
            id,
            price: price ? price : item.price,
            title: title ? title : item.title,
            category: category ? category : item.category,
            description: description ? description : item.description,
            image: image ? image : item.image,
          }
        : item
    );
    writeProduct(updateArr);
    res.send("success");
  });
});

//dalete product
app.delete("/product/:id", (req, res) => {
  readProduct((products) => {
    const updateArr = products.filter((item) => item.id !== +req.params.id);
    writeProduct(updateArr);
  });
});
// filter by slider
// app.get("/product", (req, res) => {
//   readProduct((products) => {
//     const min = 100;
//     const max = 1000;

//     const product = products.filter(
//       (item) => item.price >= min && item.price <= max
//     );
//     if (product) {
//       res.send(product);
//     } else {
//       res.status(404);
//       res.send();
//     }
//   });
// });

app.listen(8080);
