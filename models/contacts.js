const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const getContactById = async (contactId) => {
  const contactIdString = String(contactId);
  const contactsAll = await listContacts();
  const result = contactsAll.find((item) => item.id === contactIdString);
  return result || null;
};

const removeContact = async (contactId) => {
  const contactIdString = String(contactId);
  const contactsAll = await listContacts();
  const index = contactsAll.findIndex((item) => item.id === contactIdString);
  if (index === -1) {
    return null;
  }
  const [result] = contactsAll.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contactsAll, null, 2));
  return result;
};

const addContact = async (body) => {
  const contactsAll = await listContacts();
  const newContact = {
    id: nanoid(),
    ...body,
  };
  contactsAll.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contactsAll, null, 2));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contactIdString = String(contactId);
  const contactsAll = await listContacts();
  const index = contactsAll.findIndex((item) => item.id === contactIdString);
  if (index === -1) {
    return null;
  }
  contactsAll[index] = { id: contactIdString, ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contactsAll, null, 2));
  return contactsAll[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
