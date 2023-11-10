exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader("set-cookie", "loggedIn=true");
  // req.isLoggedIn = true;
  res.redirect("/");
};
