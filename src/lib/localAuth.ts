import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const USERS_KEY = "auth_users";
const SESSION_KEY = "auth_session_user_id";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
};

export type PublicUser = Omit<StoredUser, "passwordHash">;

function toPublic({ passwordHash: _omit, ...user }: StoredUser): PublicUser {
  return user;
}

async function readUsers(): Promise<StoredUser[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? (JSON.parse(raw) as StoredUser[]) : [];
}

async function writeUsers(users: StoredUser[]): Promise<void> {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function hashPassword(password: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

/** Saves a new account on this device. Throws if the email is already used. */
export async function registerUser(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<PublicUser> {
  const email = input.email.trim().toLowerCase();
  const users = await readUsers();

  if (users.some((u) => u.email === email)) {
    throw new Error("An account with this email already exists.");
  }

  const user: StoredUser = {
    id: `${Date.now()}`,
    name: input.name.trim(),
    email,
    phone: input.phone.trim(),
    passwordHash: await hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };

  await writeUsers([...users, user]);
  return toPublic(user);
}

/** Checks the email and password, then keeps the user signed in. */
export async function loginUser(email: string, password: string): Promise<PublicUser> {
  const normalized = email.trim().toLowerCase();
  const users = await readUsers();
  const user = users.find((u) => u.email === normalized);

  const hash = user ? await hashPassword(password) : null;
  if (!user || hash !== user.passwordHash) {
    throw new Error("Email or password is incorrect.");
  }

  await AsyncStorage.setItem(SESSION_KEY, user.id);
  return toPublic(user);
}

/** Returns the signed-in user, or null if nobody is logged in. */
export async function getCurrentUser(): Promise<PublicUser | null> {
  const id = await AsyncStorage.getItem(SESSION_KEY);
  if (!id) return null;
  const user = (await readUsers()).find((u) => u.id === id);
  return user ? toPublic(user) : null;
}

export async function logoutUser(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

/** True if an account with this email exists on this device. */
export async function emailExists(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  return (await readUsers()).some((u) => u.email === normalized);
}

/** Replaces the password for the account with this email. */
export async function updatePassword(email: string, newPassword: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  const users = await readUsers();
  const index = users.findIndex((u) => u.email === normalized);
  if (index === -1) {
    throw new Error("No account found with this email.");
  }
  users[index] = { ...users[index], passwordHash: await hashPassword(newPassword) };
  await writeUsers(users);
}
