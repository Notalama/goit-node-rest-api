import authService from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";

export const register = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await authService.register(email, password);

  if (!user) {
    return next(HttpError(409, "Email in use"));
  }

  res.status(201).json({ user });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  if (!result) {
    return next(HttpError(401, "Email or password is wrong"));
  }

  res.status(200).json(result);
};

export const logout = async (req, res, next) => {
  const result = await authService.logout(req.user.id);

  if (!result) {
    return next(HttpError(401, "Not authorized"));
  }

  res.status(204).send();
};

export const getCurrent = async (req, res, next) => {
  const { email, subscription, avatarURL } = req.user;

  res.status(200).json({ email, subscription, avatarURL });
};

export const updateSubscription = async (req, res, next) => {
  const { subscription } = req.body;

  const user = await authService.updateSubscription(req.user.id, subscription);

  if (!user) {
    return next(HttpError(404, "User not found"));
  }

  res.status(200).json(user);
};

export const updateAvatar = async (req, res, next) => {
  if (!req.file) {
    return next(HttpError(400, "No file uploaded"));
  }

  const result = await authService.updateAvatar(req.user.id, req.file);

  if (!result) {
    return next(HttpError(404, "User not found"));
  }

  res.status(200).json(result);
};
