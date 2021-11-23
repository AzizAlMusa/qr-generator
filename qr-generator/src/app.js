const path = require("path");
const express = require("express");
const hbs = require("hbs");

const converter = require("./utils/convert.js");
const { query } = require("express");

const app = express();

const port = process.env.PORT || 3000;

const viewsDir = path.join(__dirname, "../templates/views");
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));
const bootstrapDir = path.join(__dirname, "../node_modules/bootstrap/dist");
app.use(express.static(bootstrapDir));

app.set("view engine", "hbs");
app.set("views", viewsDir);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/convert", (req, res) => {
  const qrValue = req.query;

  if (!qrValue.plainText || qrValue.plainText == 0) {
    res.send({ error: "No value for the QR code was provided." });
    return;
  }

  converter.getQRCode(qrValue).then((response) => {
    //res.send(JSON.stringify(response.config.url));

    res.send({ body: response.data });
  });
});

app.listen(port, () => {
  console.log("server is working on port " + port);
});
