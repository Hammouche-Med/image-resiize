const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT;

const resizePic = require("./routes/upload");

app.use("/uploads", express.static("uploads"));

app.use("/resize-pic", resizePic);

app.get("/", (req, res) => {
  res.send("<h1 style='text-align: center;'>Image Resize API</h1>");
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
