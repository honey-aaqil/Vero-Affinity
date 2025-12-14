import 'server-only';

import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';

import type { UserDoc } from './collections';
import { usersCollection } from './collections';

export async function getOrCreateUser(username: string): Promise<UserDoc> {
  const collection = await usersCollection();
  
  let user = await collection.findOne({ username });
  
  if (!user) {
    const doc: Omit<UserDoc, '_id'> = {
      username,
      createdAt: new Date(),
    };
    
    const result = await collection.insertOne(doc as UserDoc);
    user = {
      _id: result.insertedId,
      ...doc,
    } as UserDoc;
  }
  
  return user;
}

export async function requireUser(): Promise<UserDoc> {
  const headersList = await headers();
  const username = headersList.get('x-user-username');
  
  if (!username) {
    throw new Error('Unauthorized: Missing username header');
  }
  
  return getOrCreateUser(username);
}

export async function getUserById(id: string | ObjectId): Promise<UserDoc | null> {
  const collection = await usersCollection();
  const objectId = typeof id === 'string' ? new ObjectId(id) : id;
  return collection.findOne({ _id: objectId });
}
