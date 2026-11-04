
const USERS_KEY = "subtrack-users";
const CURRENT_USER_KEY = "subtrack-current-user";

// Get all registered users
export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);

    if (!data) {
      return [];
    }

    const users = JSON.parse(data);

    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error("Error loading users:", error);
    return [];
  }
}

// Hash password using browser Web Crypto API
async function hashPassword(password) {
  if (!globalThis.crypto?.subtle) {
    throw new Error(
      "Secure password hashing is unavailable. Run the app using localhost or HTTPS."
    );
  }

  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// Register a new user
export async function signupUser({ name, email, password }) {
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedName || !normalizedEmail || !password) {
    throw new Error("Please fill in all fields.");
  }

  if (password.length < 8) {
    throw new Error("Password must contain at least 8 characters.");
  }

  const users = getUsers();

  const existingUser = users.find(
    (user) => user.email === normalizedEmail
  );

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await hashPassword(password);

  const newUser = {
    id: crypto.randomUUID(),
    name: normalizedName,
    email: normalizedEmail,
    passwordHash,
  };

  users.push(newUser);

  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const currentUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(currentUser)
    );

    return currentUser;
  } catch (error) {
    console.error("Error saving account:", error);

    throw new Error(
      "Unable to save your account. Please check browser storage."
    );
  }
}

// Login an existing user
export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    throw new Error("Please enter your email and password.");
  }

  const users = getUsers();

  const user = users.find(
    (item) => item.email === normalizedEmail
  );

  if (!user || !user.passwordHash) {
    throw new Error("Invalid email or password.");
  }

  const passwordHash = await hashPassword(password);

  if (user.passwordHash !== passwordHash) {
    throw new Error("Invalid email or password.");
  }

  const currentUser = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  try {
    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(currentUser)
    );
  } catch (error) {
    console.error("Error saving login session:", error);

    throw new Error(
      "Unable to save your login session. Please check browser storage."
    );
  }

  return currentUser;
}

// Get the currently logged-in user
export function getCurrentUser() {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);

    if (!data) {
      return null;
    }

    const user = JSON.parse(data);

    if (!user || !user.id || !user.name || !user.email) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

// Logout the current user
export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}
