const express = require("express");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const deviceRoutes = require("./routes/devices");

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
