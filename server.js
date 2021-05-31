const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
});

const Product = mongoose.model("Product", ProductSchema);

function readProduct(callback) {
  Product.find({})
    .exec()
    .then((productArr) => callback(productArr));
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
  Product.insertMany({
    title: req.body.title,
    price: 109.95,
    description: "blabla",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  }).then((addProduct) => {
    res.send(addProduct);
  });
});

//update product
app.put("/product/:id", (req, res) => {
  const { id } = req.params;
  const { title, price, category, description, image } = req.body;

  readProduct((products) => {
    products.map((item) =>
      item.id === id
        ? {
            price: price ? price : item.price,
            title: title ? title : item.title,
            category: category ? category : item.category,
            description: description ? description : item.description,
            image: image ? image : item.image,
          }
        : item
    );
    res.send("success");
  });
});

//dalete product
app.delete("/product/:id", (req, res) => {
  readProduct((products) => {
    const updateArr = products.find((item) => item.id !== req.params.id);
    Product.deleteMany({ updateArr }).then((deleteProduct) => res.send("yes"));
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
mongoose
  .connect("mongodb://localhost/gocod-shop", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connect");
    app.listen(8080);
  });
