const mongoose = require("mongoose");
const config = require("config");
mongoose.set("useFindAndModify", false);
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose
      .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
      .then(console.log("MongoDB connected."));
  } catch (err) {
    console.log("MongoDB connection failed.", err.message);
    // Exit
    process.exit(1);
  }
};

module.exports = connectDB;
