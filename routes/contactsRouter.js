import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from "../schemas/contactSchemas.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import authenticate from "../middlewares/authenticate.js";

const contactsRouter = express.Router();
contactsRouter.get("/", authenticate, ctrlWrapper(getAllContacts));
contactsRouter.get("/:id", authenticate, ctrlWrapper(getOneContact));
contactsRouter.delete("/:id", authenticate, ctrlWrapper(deleteContact));

contactsRouter.post(
  "/",
  authenticate,
  validateBody(createContactSchema),
  ctrlWrapper(createContact)
);

contactsRouter.put(
  "/:id",
  authenticate,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContact)
);

contactsRouter.patch(
  "/:contactId/favorite",
  authenticate,
  validateBody(updateStatusSchema),
  ctrlWrapper(updateStatusContact)
);

export default contactsRouter;
