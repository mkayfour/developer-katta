const express = require("express");
const connectDB = require("./config/db");
const users = require("./routes/api/users");
const auth = require("./routes/api/auth");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");

const app = express();

const PORT = process.env.PORT || 5000;

// connect db
connectDB();

//init middleware
app.use(express.json({ extended: false }));

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("API Running");
});

// Define routers
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/post", posts);
