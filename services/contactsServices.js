import fs from "node:fs/promises";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

const contactsPath = path.resolve("db", "contacts.json");

export const listContacts = async () => {
  const json = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(json);
};

export const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contact = contacts.find((c) => c.id === contactId);
  return contact ?? null;
};

export const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const contact = contacts.find((c) => c.id === contactId);

  if (!contact) {
    return null;
  }
  const filteredContacts = contacts.filter((c) => c.id != contactId);
  await writeContacts(filteredContacts);
  return contact;
};

export const addContact = async (name, email, phone) => {
  const newContact = { id: uuidv4(), name, email, phone };
  const contacts = await listContacts();
  contacts.push(newContact);

  await writeContacts(contacts);
  return newContact;
};

export const updateContact = async (id, name, email, phone) => {
  const contacts = await listContacts();
  const contact = contacts.find((c) => c.id === id);

  if (!contact) {
    return null;
  }

  if (name != undefined) contact.name = name;
  if (email != undefined) contact.email = email;
  if (phone != undefined) contact.phone = phone;

  await writeContacts(contacts);
  return contact;
};

const writeContacts = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf-8");
};
