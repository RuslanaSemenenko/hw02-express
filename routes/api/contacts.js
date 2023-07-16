const express = require("express");
const router = express.Router();
const Joi = require("joi");
const fs = require("fs/promises");

const contactsFilePath = "./models/contacts.json";

const loadContacts = async () => {
  try {
    const data = await fs.readFile(contactsFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading contacts file:", error);
    return [];
  }
};

const saveContacts = async (contacts) => {
  try {
    await fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2));
  } catch (error) {
    console.error("Error writing contacts file:", error);
  }
};

const listContacts = async (req, res, next) => {
  const contacts = await loadContacts();
  res.json(contacts);
};

const getContactById = async (req, res, next) => {
  const contacts = await loadContacts();
  const { contactId } = req.params;
  const contact = contacts.find((c) => c.id === contactId);

  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

const validateContact = (contact) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  });

  return schema.validate(contact);
};

const addContact = async (req, res, next) => {
  const contacts = await loadContacts();
  const { name, email, phone } = req.body;
  const newContact = { id: nanoid(), name, email, phone };

  const { error } = validateContact(newContact);

  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  contacts.push(newContact);
  await saveContacts(contacts);

  res.status(201).json(newContact);
};

const removeContact = async (req, res, next) => {
  const contacts = await loadContacts();
  const { contactId } = req.params;
  const index = contacts.findIndex((c) => c.id === contactId);

  if (index !== -1) {
    contacts.splice(index, 1);
    await saveContacts(contacts);
    res.json({ message: "Contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

const updateContact = async (req, res, next) => {
  const contacts = await loadContacts();
  const { contactId } = req.params;
  const { name, email, phone } = req.body;

  if (!name && !email && !phone) {
    res.status(400).json({ message: "Missing fields" });
    return;
  }

  const index = contacts.findIndex((c) => c.id === contactId);

  if (index !== -1) {
    const updatedContact = { ...contacts[index], name, email, phone };
    contacts[index] = updatedContact;
    await saveContacts(contacts);
    res.json(updatedContact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

router.get("/", listContacts);
router.get("/:contactId", getContactById);
router.post("/", addContact);
router.delete("/:contactId", removeContact);
router.put("/:contactId", updateContact);

module.exports = router;
