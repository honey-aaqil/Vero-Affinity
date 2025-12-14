import 'server-only';

import type { Document, GridFSFile, ObjectId } from 'mongodb';

import { env } from './env';
import { getCollection } from './mongo';

export interface UserDoc extends Document {
  _id: ObjectId;
  username: string;
  createdAt: Date;
}

export interface ChatDoc extends Document {
  _id: ObjectId;
  senderId: ObjectId;
  senderAlias: string;
  text: string;
  ciphertext?: string;
  plaintext?: string;
  type: 'text' | 'image' | 'voice';
  createdAt: Date;
  mediaId?: ObjectId;
}

export interface AuditLogDoc extends Document {
  _id: ObjectId;
  at: Date;
  action: string;
  actorId?: ObjectId;
  meta?: Document;
}

const mediaBucket = env.GRIDFS_MEDIA_BUCKET ?? 'media';

export const collectionNames = {
  users: 'users',
  chats: 'chats',
  auditLog: 'audit_log',
  mediaFiles: `${mediaBucket}.files`,
  mediaChunks: `${mediaBucket}.chunks`,
} as const;

export function usersCollection() {
  return getCollection<UserDoc>(collectionNames.users);
}

export function chatsCollection() {
  return getCollection<ChatDoc>(collectionNames.chats);
}

export function auditLogCollection() {
  return getCollection<AuditLogDoc>(collectionNames.auditLog);
}

export function mediaFilesCollection() {
  return getCollection<GridFSFile>(collectionNames.mediaFiles);
}

export function mediaChunksCollection() {
  return getCollection<Document>(collectionNames.mediaChunks);
}
