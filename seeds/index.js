const mongoose = require("mongoose");
const { technology, company } = require("./seedHelper");
const Product = require("../models/product");

mongoose.connect("mongodb://localhost:27017/flash", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)]; //creates random number to access elements in array

const seedDB = async () => {
  // it adds random data to our data initially to work upon
  await Product.deleteMany();
  for (let i = 0; i < 30; i++) {
    const price = Math.floor(Math.random() * 100) + 100;
    const product = await new Product({
      author: "60ffe9ffc4e2b932dcf05a88",
      name: `${sample(company)} ${sample(technology)}`,
      price,
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa dicta dolorem in quod similique a autem! Itaque similique veniam quis, aperiam ea possimus, unde, esse recusandae aliquam officiis minus quibusdam.",
      images: [
        {
          url: "https://res.cloudinary.com/dgeeijv0k/image/upload/v1628000226/Flash/o1z1thwa66o1l7ctc7zk.jpg",
          filename: "Flash/o1z1thwa66o1l7ctc7zk",
        },
        {
          url: "https://res.cloudinary.com/dgeeijv0k/image/upload/v1628000228/Flash/xfsdw0kui9hoew7grpbf.jpg",
          filename: "Flash/xfsdw0kui9hoew7grpbf",
        },
      ],
    });
    await product.save();
  }
};
// calling seedDB to fill in the database
seedDB().then(() => {
  mongoose.connection.close();
});
