const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
require("dotenv").config();
const upload = require("express-fileupload");

const path = require("path");
__dirname = path.resolve();

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(upload());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.use(notFound);
app.use(errorHandler);

app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend",'build','index.html'));
});

connect(process.env.MONGO_URI).then(
  app.listen(process.env.PORT || 5000, () => {
    console.log(`server run on port number ${process.env.PORT}`);
  })
);
