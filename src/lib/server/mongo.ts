import 'server-only';

import type { Collection, Db, Document } from 'mongodb';
import { MongoClient } from 'mongodb';

import { env } from './env';

type GlobalWithMongo = typeof globalThis & {
  __mongoClientPromise?: Promise<MongoClient>;
};

const globalForMongo = globalThis as GlobalWithMongo;

const client = new MongoClient(env.MONGODB_URI);

const clientPromise = globalForMongo.__mongoClientPromise ?? client.connect();

globalForMongo.__mongoClientPromise = clientPromise;

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

export async function getDb(dbName: string = env.MONGODB_DB): Promise<Db> {
  const connectedClient = await getMongoClient();
  return connectedClient.db(dbName);
}

export async function getCollection<TSchema extends Document = Document>(
  name: string,
  dbName?: string
): Promise<Collection<TSchema>> {
  const db = await getDb(dbName);
  return db.collection<TSchema>(name);
}
