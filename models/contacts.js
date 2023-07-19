const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");
const { HttpError } = require("../helpers/HttpErrors");
const { addSchema } = require("../routes/api/validationSchemas");

const contactsPath = path.join(__dirname, "contacts.json");

const readContactsFile = async () => {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeContactsFile = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");
};

const listContacts = async (req, res, next) => {
  try {
    const contacts = await readContactsFile();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contactIdString = String(id);
    const contactsAll = await readContactsFile();
    const result = contactsAll.find((item) => item.id === contactIdString);
    if (!result) {
      throw new HttpError(404, "Contact not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contactIdString = String(id);
    const contactsAll = await readContactsFile();
    const index = contactsAll.findIndex((item) => item.id === contactIdString);
    if (index === -1) {
      throw new HttpError(404, "Contact not found");
    }
    const [result] = contactsAll.splice(index, 1);
    await writeContactsFile(contactsAll);
    res.status(200).json({ message: "Contact deleted", result });
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw new HttpError(
        400,
        `${error.message} : missing required name, email, or phone field`
      );
    }
    const contactsAll = await readContactsFile();
    const newContact = {
      id: nanoid(),
      ...req.body,
    };
    contactsAll.push(newContact);
    await writeContactsFile(contactsAll);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = updateSchema.validate(req.body);
    if (error) {
      throw new HttpError(400, `${error.message} : missing fields`);
    }
    const contactIdString = String(id);
    const contactsAll = await readContactsFile();
    const index = contactsAll.findIndex((item) => item.id === contactIdString);
    if (index === -1) {
      throw new HttpError(404, "Contact not found");
    }
    contactsAll[index] = { id: contactIdString, ...req.body };
    await writeContactsFile(contactsAll);
    res.status(200).json(contactsAll[index]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
