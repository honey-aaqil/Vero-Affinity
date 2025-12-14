import { ObjectId } from 'mongodb';
import { JWTPayload } from 'jose';

export interface User {
  _id?: ObjectId;
  username: string;
  passwordHash: string;
  role: 'admin' | 'partner';
  encryptionKey: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface AuditLog {
  _id?: ObjectId;
  userId: ObjectId;
  action: string;
  timestamp: Date;
  details?: Record<string, any>;
}

export interface SessionPayload extends JWTPayload {
  userId: string;
  username: string;
  role: string;
}