import { createUser } from "../utils/user.mjs";
import { addUser, getUser } from "../services/users.mjs";

const username = process.env.ADMIN_USERNAME;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!username || !email || !password) {
  throw new Error(
    "ADMIN_USERNAME, ADMIN_EMAIL and ADMIN_PASSWORD are required",
  );
}

const existingUsername = await getUser(username);
const existingEmail = await getUser(undefined, email);

if (existingUsername.length > 0 || existingEmail.length > 0) {
  throw new Error("Username or email is already registered");
}

// assigns the admin role to the user
const items = await createUser({
  username,
  email,
  password,
  role: "admin",
});

await addUser(items);

console.log("Admin user created successfully");
