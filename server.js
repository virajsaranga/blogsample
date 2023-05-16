require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
var cors = require("cors");
const { json, urlencoded } = require("body-parser");

const routes = require("./api/routes/index");

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use( 
  cors({
    origin: "*", // <-- allow all origins
    credentials: true,
  })
);

app.use("/", routes);

//test api
// app.get("/api", (req, res) => {
//   res.json({ success: 1, message: "Hello from server..." });
// });


app.use("/api/blogs", require("./api/routes/blogs/blogs.routes"));
app.use("/api/user", require("./api/routes/user/user.routes"));

//server
const port = process.env.PORT || 5000;    
app.listen(port, () => {
  console.log(`Listing to port ${port}`);
});
  