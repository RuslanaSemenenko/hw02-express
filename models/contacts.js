const mongoose = require("mongoose");
const { HttpError } = require("../helpers/HttpErrors");
const { addSchema } = require("../schemas/validationSchemas");

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  favorite: Boolean, // Add this field to the schema
});

const Contact = mongoose.model("Contact", contactSchema);

const listContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact) {
      throw new HttpError(404, "Contact not found");
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.findByIdAndRemove(id);
    if (!result) {
      throw new HttpError(404, "Contact not found");
    }
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
    const newContact = new Contact({ ...req.body });
    await newContact.save();
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

    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedContact) {
      throw new HttpError(404, "Contact not found");
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;

    if (favorite === undefined) {
      throw new HttpError(400, "missing field favorite");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      { new: true }
    );

    if (!updatedContact) {
      throw new HttpError(404, "Contact not found");
    }

    res.status(200).json(updatedContact);
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
  updateStatusContact,
};
