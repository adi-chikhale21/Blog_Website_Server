const mongoose = require("mongoose");
const mongo_url = process.env.MONGO_URL;

module.exports = async function () {
  try {
    await mongoose.connect(mongo_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Mongodb is connected to ${mongoose.connection.name}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
