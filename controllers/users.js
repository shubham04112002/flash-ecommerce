const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body.user;
    const user = await new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Successfully registerd you");
      res.redirect("/products");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.loginUser = (req, res) => {
  const redirectUrl = req.session.returnTo || "/products";
  delete req.session.returnTo;
  req.flash("success", "Welcome Back!");
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
  req.logOut();
  req.flash("success", "Logged you out successfully");
  res.redirect("/products");
};
