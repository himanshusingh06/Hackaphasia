const express = require("express");
const router = express.Router();
const { handleHealthQuery } = require("../controllers/llmController");

router.post("/health-query", handleHealthQuery);

module.exports = router;
