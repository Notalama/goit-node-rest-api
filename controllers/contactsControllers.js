import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (_, res) => {
  const contacts = await contactsService.listContacts();
  res.status(200).json(contacts);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id);

  if (!contact) {
    throw HttpError(404);
  }

  res.status(200).json(contact);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const deleted = await contactsService.removeContact(id);

  if (!deleted) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(deleted);
};

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const newContact = await contactsService.addContact(name, email, phone);
  res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  const updatedContact = await contactsService.updateContact(
    id,
    body.name,
    body.email,
    body.phone
  );
  
  if (!updatedContact) {
    throw HttpError(404);
  }
  res.status(200).json(updatedContact);
};
