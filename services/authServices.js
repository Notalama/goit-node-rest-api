import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import User from "../models/User.js";

async function register(email, password) {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: "250", d: "retro" }, true);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    subscription: "starter",
    avatarURL,
  });

  return {
    email: newUser.email,
    subscription: newUser.subscription,
    avatarURL: newUser.avatarURL,
  };
}

async function login(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  await user.update({ token });

  return {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    },
  };
}

async function logout(userId) {
  const user = await User.findByPk(userId);
  if (!user) {
    return null;
  }

  await user.update({ token: null });
  return true;
}

async function updateSubscription(userId, subscription) {
  const user = await User.findByPk(userId);
  if (!user) {
    return null;
  }

  await user.update({ subscription });
  return {
    email: user.email,
    subscription: user.subscription,
  };
}

async function updateAvatar(userId, file) {
  const user = await User.findByPk(userId);
  if (!user) {
    return null;
  }

  const extension = path.extname(file.originalname);
  const filename = `${userId}_${nanoid()}${extension}`;

  const tempPath = file.path;
  const avatarsDir = path.join(process.cwd(), "public", "avatars");
  const newPath = path.join(avatarsDir, filename);

  try {
    await fs.rename(tempPath, newPath);

    const avatarURL = `/avatars/${filename}`;

    await user.update({ avatarURL });

    return {
      avatarURL,
    };
  } catch (error) {
    try {
      await fs.unlink(tempPath);
    } catch (unlinkError) {
      console.error("Error deleting temporary file:", unlinkError);
    }
    throw error;
  }
}

export default {
  register,
  login,
  logout,
  updateSubscription,
  updateAvatar,
};
