exports.getLogin = (req, res, next) => {
  // const isLogged = req.get("Cookie")
  //   ? req.get("Cookie").split("=")[1] === "true"
  //   : false;

  // const isLogged = req.get("Cookie").split("=")[1] === "true";
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  // res.setHeader("set-cookie", "loggedIn=true");
  // req.isLoggedIn = true;
  res.redirect("/");
};
