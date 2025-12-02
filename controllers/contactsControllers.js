import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

export const getAllContacts = ctrlWrapper(async (_, res) => {
  const contacts = await contactsService.listContacts();
  res.status(200).json(contacts);
});

export const getOneContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id);

  if (!contact) {
    throw HttpError(404);
  }

  res.status(200).json(contact);
});

export const deleteContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const deleted = await contactsService.removeContact(id);

  if (!deleted) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(deleted);
});

export const createContact = ctrlWrapper(async (req, res) => {
  const { name, email, phone } = req.body;
  const newContact = await contactsService.addContact(name, email, phone);
  res.status(201).json(newContact);
});

export const updateContact = ctrlWrapper(async (req, res) => {
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
});

export const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;

  if (favorite === undefined) {
    throw HttpError(400, "Not valid favorite");
  }

  const contact = await contactsService.getContactById(id);
  if (!contact) {
    throw HttpError(404);
  }

  const updatedContact = await contactsService.updateStatusContact(
    id,
    favorite
  );

  res.status(200).json(updatedContact);
};
