// user roles in an easy to save in DB types
// cause SQLite doesn't have enums
export enum USER_ROLE {
  ADMIN = 0,
  EMPLOYEE = 1,
}

// rounds to generate salt for passwords
export const GEN_SALT_ROUNDS = 10;
