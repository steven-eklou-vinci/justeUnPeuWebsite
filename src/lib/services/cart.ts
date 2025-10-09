import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../database/mongodb';
import { logger } from '../logger';

export interface CartItemDB {
  productId: number;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  addedAt: Date;
}

export interface UserCart {
  _id?: ObjectId;
  userId: ObjectId;
  items: CartItemDB[];
  updatedAt: Date;
  createdAt: Date;
}

export async function getUserCart(userId: string): Promise<CartItemDB[]> {
  try {
    const db = await connectToDatabase();
    const cartCollection = db.collection<UserCart>('carts');

    const userCart = await cartCollection.findOne({ userId: new ObjectId(userId) });
    
    return userCart?.items || [];
  } catch (error) {
    logger.error({ error, userId }, 'Failed to get user cart');
    return [];
  }
}

export async function saveUserCart(userId: string, items: CartItemDB[]): Promise<boolean> {
  try {
    const db = await connectToDatabase();
    const cartCollection = db.collection<UserCart>('carts');

    await cartCollection.updateOne(
      { userId: new ObjectId(userId) },
      {
        $set: {
          items,
          updatedAt: new Date()
        },
        $setOnInsert: {
          userId: new ObjectId(userId),
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    logger.info({ userId, itemCount: items.length }, 'Cart saved successfully');
    return true;
  } catch (error) {
    logger.error({ error, userId }, 'Failed to save user cart');
    return false;
  }
}

export async function clearUserCart(userId: string): Promise<boolean> {
  try {
    const db = await connectToDatabase();
    const cartCollection = db.collection<UserCart>('carts');

    await cartCollection.updateOne(
      { userId: new ObjectId(userId) },
      {
        $set: {
          items: [],
          updatedAt: new Date()
        }
      }
    );

    logger.info({ userId }, 'Cart cleared successfully');
    return true;
  } catch (error) {
    logger.error({ error, userId }, 'Failed to clear user cart');
    return false;
  }
}