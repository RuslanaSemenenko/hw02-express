const express = require("express");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts.js");

const router = express.Router();

const isIdExist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contactsAll = await readContactsFile();
    const index = contactsAll.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new HttpError(404, "Contact not found");
    }
    next();
  } catch (error) {
    next(error);
  }
};

router.get("/", listContacts);

router.get("/:id", getContactById);

router.post("/", addContact);

router.delete("/:id", removeContact);

router.put("/:id", updateContact);

module.exports = router;