const express = require("express");
const router = express.Router();

router.use("/admins", require("./admins"));
router.use("/customers", require("./customers"));

module.exports = router;
