if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const productsRoute = require("./routes/products");
const usersRoute = require("./routes/users");
const reviewsRouter = require("./routes/reviews");
const ExpressError = require("./utils/ExpressError");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const MongoStore = require("connect-mongo");

const dbUrl = process.env.DB_URL;
// "mongodb://localhost:27017/flash"
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database Connected");
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret: process.env.SESSION_SECRET,
  touchAfter: 24 * 60 * 60,
});

app.use(
  session({
    saveUninitialized: true,
    store,
    resave: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/products", productsRoute);
app.use("/users", usersRoute);
app.use("/products/:id/review", reviewsRouter);

app.get("/", (req, res) => {
  res.render("home");
});


app.all("*", (req, res, next) => {
  req.flash("error", "No such page exists");
  // res.redirect("/products");
  next(new ExpressError("Page Not Found!!", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no!!! Something went wrong";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server up and running on port ${port}`);
});
