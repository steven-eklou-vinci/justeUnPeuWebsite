import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../database/mongodb';
import { hashPassword, verifyPassword } from '../security/crypto';
import { logger } from '../logger';
import type { User, SafeUser, AuthResult } from '@/types/auth';
import type { RegisterDto, LoginDto } from '@/lib/validation/auth';

function toSafeUser(user: User): SafeUser {
  return {
    id: user._id!.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    address: user.address,
    emailVerified: !!user.emailVerifiedAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export async function registerUser(data: RegisterDto): Promise<AuthResult> {
  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection<User>('users');

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await usersCollection.findOne({ email: data.email });
    if (existingUser) {
      logger.info({ email: data.email }, 'Registration attempt with existing email');
      return {
        success: false,
        error: 'Un compte avec cette adresse email existe déjà',
        code: 'USER_EXISTS'
      };
    }

    // Hacher le mot de passe
    const passwordHash = await hashPassword(data.password);
    const now = new Date();
    
    // Créer l'objet utilisateur
    const newUser: User = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      passwordHash,
      emailVerifiedAt: now, // Auto-vérifié car pas de Mailjet
      createdAt: now,
      updatedAt: now
    };

    // Insérer l'utilisateur dans la base de données
    const result = await usersCollection.insertOne(newUser);
    
    logger.info({
      userId: result.insertedId.toString(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName
    }, 'User registered successfully in database');

    return {
      success: true,
      user: toSafeUser({ ...newUser, _id: result.insertedId })
    };
  } catch (error) {
    logger.error({ error, email: data.email }, 'Registration failed');
    return {
      success: false,
      error: 'Une erreur est survenue lors de l\'inscription',
      code: 'REGISTRATION_FAILED'
    };
  }
}

export async function loginUser(data: LoginDto): Promise<AuthResult> {
  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection<User>('users');

    // Rechercher l'utilisateur par email
    const user = await usersCollection.findOne({ email: data.email });
    if (!user) {
      logger.info({ email: data.email }, 'Login attempt with non-existent email');
      return {
        success: false,
        error: 'Email ou mot de passe incorrect',
        code: 'INVALID_CREDENTIALS'
      };
    }

    // Vérifier le mot de passe
    const isValidPassword = await verifyPassword(data.password, user.passwordHash);
    if (!isValidPassword) {
      logger.info({ 
        userId: user._id!.toString(),
        email: data.email 
      }, 'Login attempt with invalid password');
      return {
        success: false,
        error: 'Email ou mot de passe incorrect',
        code: 'INVALID_CREDENTIALS'
      };
    }

    // Mettre à jour la date de dernière connexion
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { updatedAt: new Date() } }
    );

    logger.info({
      userId: user._id!.toString(),
      email: user.email,
      firstName: user.firstName
    }, 'User logged in successfully');

    return {
      success: true,
      user: toSafeUser(user)
    };
  } catch (error) {
    logger.error({ error, email: data.email }, 'Login failed');
    return {
      success: false,
      error: 'Une erreur est survenue lors de la connexion',
      code: 'LOGIN_FAILED'
    };
  }
}

export async function getUserById(userId: string): Promise<SafeUser | null> {
  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection<User>('users');

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return null;
    }

    return toSafeUser(user);
  } catch (error) {
    logger.error({ error, userId }, 'Failed to get user by ID');
    return null;
  }
}
