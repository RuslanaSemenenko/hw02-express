const express = require("express");
const router = express.Router();
const { updateStatusContact } = require("../../models/contacts");

router.patch("/:contactId/favorite", updateStatusContact);

module.exports = router;
