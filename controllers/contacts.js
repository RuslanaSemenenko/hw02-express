const Contact = require("../models/contacts");
const { HttpError } = require("../helpers/HttpErrors");

const listContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};


module.exports = { listContacts };
