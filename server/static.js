const express = require("express");
const app = express();
const port = 6002;
app.use(express.static("./../dist"));
app.listen(port, "0.0.0.0", () =>
  console.log(`Music listening on port ${port}!`)
);
