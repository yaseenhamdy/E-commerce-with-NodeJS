import bcrypt from "bcrypt";
import userModel from "../Modules/users/user.model.js";
import { ROLES } from "../Constants/roles.js";

const SALT_ROUNDS = 8;

const seedUsers = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@test.com",
    phoneNumber: "01000000001",
    password: "password123",
    role: ROLES.ADMIN,
    isEmailVerified: true,
  },
  {
    firstName: "Seller",
    lastName: "One",
    email: "seller@test.com",
    phoneNumber: "01000000002",
    password: "password123",
    role: ROLES.SELLER,
    isEmailVerified: true,
  },
  {
    firstName: "Customer",
    lastName: "One",
    email: "customer@test.com",
    phoneNumber: "01000000003",
    password: "password123",
    role: ROLES.CUSTOMER,
    isEmailVerified: true,
  },
];

/**
 * Hashes passwords and inserts seed users if they don't already exist (by email).
 * Safe to run on every server start (idempotent).
 */
export async function runSeedUsers() {
  let created = 0;
  for (const u of seedUsers) {
    const exists = await userModel.findOne({ email: u.email });
    if (exists) continue;

    const hashed = await bcrypt.hash(u.password, SALT_ROUNDS);
    await userModel.create({
      ...u,
      password: hashed,
    });
    created++;
  }
  if (created > 0) {
    console.log(`Seed: Created ${created} user(s) (admin, seller, customer).`);
  }
}
