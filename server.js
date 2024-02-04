const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const bcyrpt = require("bcrypt");
const passport = require("passport");
const initializePassport = require("./passport-config");
const flash = require("express-flash");
const session = require("express-session");
//====================================================================================================================================

initializePassport(
  passport,
  (username) => {
    return users.find((user) => {
      return user.username == username;
    });
  },
  (id) => {
    return users.find((user) => {
      return user.id == id;
    });
  }
);

const users = []; // simulating a user in a database

// MiddleWare
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Template Engine (Handlebars)
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

// Routes
app.get("/", (req, res) => {
  console.log(req.session);
  res.render("homepage");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcyrpt.hash(password, 10); // takes in the password variable from the form and hashes it to an unique/random string, the second parameter determines how many times you want to hash it, essentially the higher the number, the more times it will be hashed therefore the more secure the password will be.

    users.push({
      id: Math.floor(Math.random() * 100000),
      username,
      password: hashedPassword,
    }); // information that will be passed to the database saving a user's credentials

    res.redirect("/login"); // If created user is successful client will be redirected to the login page to attempt to login with created information.
  } catch (err) {
    res.redirect("/signup"); // if unsuccessful, the client will be redirected to the signup page.
  }

  console.log(users);
});
//====================================================================================================================================

app.listen(3000, () => {
  console.log("now listening");
});
