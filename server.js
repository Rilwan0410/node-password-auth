const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
//====================================================================================================================================

// MiddleWare
app.use(express.json());

// Template Engine (Handlebars)
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

// Routes
app.get("/", (req, res) => {
  res.render("homepage");
});
//====================================================================================================================================

app.listen(3000, () => {
  console.log("now listening");
});
