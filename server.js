const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
require("dotenv").config();

app.use(express.static("client/build"));

const CustomerSchema = Schema({
  name: String,
  lastName: String,
  phone: String,
  mail: String,
  adress: String,
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
});

const OrderSchema = Schema({
  numberOrder: String,
  date: Date,
  cost: Number,
  ifPay: Boolean,
  customer: { type: Schema.Types.ObjectId, ref: "Customer" },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

const ProductSchema = Schema({
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
});

const Product = model("Product", ProductSchema);
const Customer = model("Customer", CustomerSchema);
const Order = model("Order", OrderSchema);

//*************************************************************** */

//db product

function readProduct(callback) {
  Product.find({})
    .exec()
    .then((productArr) => callback(productArr));
}
//filter by id
app.get("/api/product/:id", (req, res) => {
  const { id } = req.params;
  Product.findById(id)
    .then((product) => res.send(product))
    .catch((err) => {
      res.status(404);
      res.send(err);
    });
});

//add new product
app.post("/api/product", (req, res) => {
  Product.insertMany([
    {
      title: req.body.title,
      price: 109.95,
      description: "blabla",
      category: "men's clothing",
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    },
  ]).then((addProduct) => {
    res.send(addProduct);
  });
});

//filter by title search
app.get("/api/product", (req, res) => {
  readProduct((products) => {
    const { title, category } = req.query;
    console.log(title);
    if (title || category) {
      let updateArr = products.filter(
        (item) => item.title.includes(title) || item.category.includes(category)
      );
      res.send(updateArr.length ? updateArr : "no data");
    } else {
      res.send(products);
    }
  });
});

//update product
app.put("/api/product/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  const { title, price, category, description, image } = req.body;
  readProduct((products) => {
    products.map((item) =>
      item.id === id
        ? Product.updateOne({
            price: price ? price : item.price,
            title: title ? title : item.title,
            category: category ? category : item.category,
            description: description ? description : item.description,
            image: image ? image : item.image,
          }).then((updateProduct) => res.send(updateProduct))
        : item
    );
  });
});

//dalete product
app.delete("/api/product/:id", (req, res) => {
  readProduct((products) => {
    const updateArr = products.find((item) => item.id !== req.params.id);
    Product.deleteMany({ updateArr }).then((deleteProduct) => res.send("yes"));
  });
});
//***************************************************************** */

//db custumer

function readCustomer(callback) {
  Customer.find({})
    .exec()
    .then((CustomerArr) => callback(CustomerArr));
}

app.post("/customer", (req, res) => {
  Customer.insertMany([
    {
      name: req.body.name,
      lastName: "yam",
      phone: req.body.phone,
      mail: "yair@gmail.com",
      adress: "bne brak",
    },
  ]).then((customer) => {
    res.send(customer);
  });
});
app.get("/customer", (req, res) => {
  readCustomer((customer) => {
    const { q } = req.query;
    if (q) {
      let updateArr = customer.filter(
        (item) => item.phone.includes(q) || item.mail.includes(q)
      );
      res.send(updateArr.length ? updateArr : "no data");
    } else {
      res.send(customer);
    }
  });
});

//***************************************************************** */

//db order

function readOrder(callback) {
  Order.find({})
    .exec()
    .then((OrderArr) => callback(OrderArr));
}
//filter by title search
app.get("/order", (req, res) => {
  readOrder((order) => {
    const { q } = req.query;
    if (q) {
      let updateArr = order.filter(
        (item) => item.phone.includes(q) || item.mail.includes(q)
      );
      res.send(updateArr.length ? updateArr : "no data");
    } else {
      res.send(order);
    }
  });
});

app.post("/order", (req, res) => {
  Order.insertMany([
    {
      numberOrder: "123456",
      date: "2012-04-23T18:25:43.511Z",
      cost: 750,
      ifPay: true,
      customer: Customer._id,
      // products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    },
  ]).then((order) => {
    res.send(order);
  });
});

//***************************************************************** */
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

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/client/build/index.html");
});
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("connect");
    app.listen(process.env.PORT || 8080);
  });
