import { nanoid } from "nanoid";
import Contact from "../models/Contact.js";

async function listContacts(userId, page = 1, limit = 20, favorite = null) {
  const offset = (page - 1) * limit;

  const where = { owner: userId };

  if (favorite !== null) {
    where.favorite = favorite;
  }

  const { count, rows } = await Contact.findAndCountAll({
    where,
    limit,
    offset,
  });

  return {
    contacts: rows,
    total: count,
    page,
    limit,
  };
}

async function getContactById(contactId, userId) {
  return await Contact.findOne({ where: { id: contactId, owner: userId } });
}

async function removeContact(contactId, userId) {
  const contact = await Contact.findOne({
    where: { id: contactId, owner: userId },
  });
  if (!contact) return null;
  await contact.destroy();
  return contact;
}

async function addContact(data, userId) {
  const newContact = await Contact.create({
    id: nanoid(21),
    ...data,
    owner: userId,
  });
  return newContact;
}

async function updateContact(contactId, updateData, userId) {
  const contact = await Contact.findOne({
    where: { id: contactId, owner: userId },
  });
  if (!contact) return null;
  await contact.update(updateData);
  return contact;
}

async function updateStatusContact(contactId, body, userId) {
  const contact = await Contact.findOne({
    where: { id: contactId, owner: userId },
  });
  if (!contact) return null;
  await contact.update(body);
  return contact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
