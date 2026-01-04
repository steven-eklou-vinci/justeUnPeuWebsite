import { MongoClient, Db } from 'mongodb';
import { logger } from '../logger';

if (!process.env.MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

const uri = process.env.MONGODB_URI;

// Configuration différente selon l'environnement
const isAtlasConnection = uri.includes('mongodb+srv://');

const options = isAtlasConnection ? {
  // Configuration pour MongoDB Atlas
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000, // Augmenté pour Atlas
  socketTimeoutMS: 0, // Pas de timeout pour Atlas
  connectTimeoutMS: 10000,
  maxIdleTimeMS: 30000,
  retryWrites: true,
  w: 'majority' as const,
  // Pas besoin de spécifier TLS explicitement pour Atlas (automatique avec mongodb+srv://)
} : {
  // Configuration pour MongoDB local
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    
    cachedDb = db;
    
    logger.info('Successfully connected to MongoDB');
    return db;
  } catch (error) {
    logger.error({ error }, 'Failed to connect to MongoDB');
    throw error;
  }
}

// Alias pour getDb
export async function getDb(): Promise<Db> {
  return connectToDatabase();
}

export { clientPromise };