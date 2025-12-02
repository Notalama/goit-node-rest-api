import Contact from "../models/Contact.js";

export const listContacts = async () => {
  const contacts = await Contact.findAll();
  return contacts;
};

export const getContactById = async (contactId) => {
  return await Contact.findByPk(contactId);
};

export const addContact = async (name, email, phone) => {
  const newContact = await Contact.create({
    name,
    email,
    phone,
  });

  return newContact;
};

export const removeContact = async (contactId) => {
  const contact = await Contact.findByPk(contactId);

  if (!contact) {
    return null;
  }

  await contact.destroy();
  return contact;
};

export const updateContact = async (
  contactId,
  name,
  email,
  phone,
  favorite
) => {
  const contact = await Contact.findByPk(contactId);

  if (!contact) {
    return null;
  }

  if (name !== undefined) contact.name = name;
  if (email !== undefined) contact.email = email;
  if (phone !== undefined) contact.phone = phone;
  if (favorite !== undefined) contact.favorite = favorite;

  await contact.save();
  return contact;
};

export const updateStatusContact = async (contactId, favorite) => {
  const contact = await Contact.findByPk(contactId);
  if (!contact) {
    throw new Error(`Contact id: ${contactId} not existed`);
  }

  contact.favorite = favorite;
  await contact.save();

  return contact;
};
