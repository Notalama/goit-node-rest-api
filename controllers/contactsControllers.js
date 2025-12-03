import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  let favorite = null;
  if (req.query.favorite !== undefined) {
    favorite = req.query.favorite === "true";
  }

  const result = await contactsService.listContacts(
    req.user.id,
    page,
    limit,
    favorite
  );
  res.status(200).json(result);
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id, req.user.id);
  if (!contact) {
    return next(HttpError(404));
  }
  res.status(200).json(contact);
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsService.removeContact(id, req.user.id);
  if (!contact) {
    return next(HttpError(404));
  }
  res.status(200).json(contact);
};

export const createContact = async (req, res, next) => {
  const contact = await contactsService.addContact(req.body, req.user.id);
  if (!contact) {
    return next(HttpError(409, `Contact already exists`));
  }
  res.status(201).json(contact);
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsService.updateContact(
    id,
    req.body,
    req.user.id
  );
  if (!contact) {
    return next(HttpError(404));
  }
  res.status(200).json(contact);
};

export const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contactsService.updateStatusContact(
    contactId,
    req.body,
    req.user.id
  );
  if (!contact) {
    return next(HttpError(404, "Not found"));
  }
  res.status(200).json(contact);
};
