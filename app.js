const express = require("express");
var exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");

const app = express();
const ideas = require("./routes/ideas");
const users = require("./routes/users");

require("./config/passport")(passport);
const db = require("./config/database");

mongoose
  .connect(db.mongoURI, {
    //useMongoClient: true
    useNewUrlParser: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

//loading imagess
//app.use("/public", express.static(__dirname + "public"));

//router

//Express handle bars middle ware

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//end express handlebars middle ware

//body parser middle ware
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//method -overirde middle Ware
app.use(methodOverride("_method"));

//end body parser middle ware
//Express-session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(express.static(path.join(__dirname, "public")));

//Global variables

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

app.use("/ideas", ideas);
app.use("/users", users);

//index route

app.get("/", (req, res) => {
  console.log(req.user);
  if (req.user != null) {
    const username = req.user.name;
    res.render("index", { username: username }); //passing data to the view
  } else {
    res.render("index"); //passing data to the view
  }
});

app.get("/raamen", (req, res) => {
  res.render("raamen"); //passing data to the view
});

app.get("/about", (req, res) => {
  res.render("about");
});

//end setting route

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
