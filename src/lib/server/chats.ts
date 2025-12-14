import 'server-only';

import { ObjectId } from 'mongodb';

import type { ChatDoc } from './collections';
import { chatsCollection } from './collections';
import type { ChatMessage } from '../types';

export async function getMessages(limit: number = 50): Promise<ChatMessage[]> {
  const collection = await chatsCollection();
  const docs = await collection
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return docs.reverse().map(docToMessage);
}

export async function insertMessage(
  senderId: string,
  senderAlias: string,
  text: string,
  type: 'text' | 'image' | 'voice' = 'text',
  mediaId?: string
): Promise<ChatMessage> {
  const collection = await chatsCollection();
  
  const doc: Omit<ChatDoc, '_id'> = {
    senderId: new ObjectId(senderId),
    senderAlias,
    text,
    plaintext: text,
    type,
    createdAt: new Date(),
    ...(mediaId && { mediaId: new ObjectId(mediaId) }),
  };

  const result = await collection.insertOne(doc as ChatDoc);
  
  return {
    id: result.insertedId.toString(),
    senderId,
    senderAlias,
    text,
    plaintext: text,
    type,
    createdAt: doc.createdAt,
    ...(mediaId && { mediaId }),
  };
}

export async function purgeMessages(): Promise<number> {
  const collection = await chatsCollection();
  const result = await collection.deleteMany({});
  return result.deletedCount;
}

function docToMessage(doc: ChatDoc): ChatMessage {
  return {
    id: doc._id.toString(),
    senderId: doc.senderId.toString(),
    senderAlias: doc.senderAlias,
    text: doc.text,
    ciphertext: doc.ciphertext,
    plaintext: doc.plaintext,
    type: doc.type,
    createdAt: doc.createdAt,
    ...(doc.mediaId && { mediaId: doc.mediaId.toString() }),
  };
}
