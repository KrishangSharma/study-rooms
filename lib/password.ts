import { hash, compare } from 'bcryptjs';

// Function to Has passwords
const hashPassword = async (password: string) => {
  const saltRounds = 10;
  const hashedPassword = await hash(password, saltRounds);
  return hashedPassword;
};

// Function to Compare passwords
const comparePassword = async (password: string, hashedPassword: string) => {
  const isMatch = await compare(password, hashedPassword);
  return isMatch;
};

export { hashPassword, comparePassword };
