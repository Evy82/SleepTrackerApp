import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from './models/User';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

interface Credentials {
  username: string;
  password: string;
}

interface RegistrationDetails extends Credentials {
  email: string;
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function generateToken(userId: number): string {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

export async function loginUser(credentials: Credentials): Promise<string | null> {
  try {
    const user = await User.findOne({ where: { username: credentials.username } });
    if (!user || !(await verifyPassword(credentials.password, user.passwordHash))) {
      return null;
    }
    return generateToken(user.id);
  } catch (error) {
    console.error('Error logging in user:', error);
    return null;
  }
}

export async function registerUser(details: RegistrationDetails): Promise<string | null> {
  try {
    const passwordHash = await hashPassword(details.password);
    const user = await User.create({ ...details, passwordHash });
    return generateToken(user.id);
  } catch (error) {
    console.error('Error registering user:', error);
    return null;
  }
}

export function verifyToken(token: string): number | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    return typeof decoded.id === 'number' ? decoded.id : null;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}