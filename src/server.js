const app = require("./index");
require("dotenv").config();

const connect = require("./configs/db");

app.listen(2345, async function () {
  await connect();
  console.log("listening on port 2345");
});
