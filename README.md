# Next.js Stealth Messenger

A stealth messaging application with authentication, featuring a camouflaged todo list interface that unlocks to reveal a hidden chat system.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB instance (local or cloud)
- npm or yarn

### Environment Setup
1. Copy the environment example:
```bash
cp .env.example .env.local
```

2. Configure your environment variables:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/nextn
MONGODB_DB_NAME=nextn

# Session Secret (IMPORTANT: Change this in production!)
SESSION_SECRET=your-super-secret-session-key-change-in-production
```

### Installation
```bash
npm install
```

### Database Seeding
Seed the database with default users:
```bash
npm run seed:users
```

This creates two accounts:
- **aaqil** (admin): `aaqil123`
- **roshini** (partner): `roshini123`

⚠️ **Important**: Change these passwords immediately in production!

### Development
```bash
npm run dev
```

The app runs on `http://localhost:9002`

## 🔐 Authentication System

The application implements a secure authentication system with:

- **Password hashing** using bcryptjs (12 salt rounds)
- **JWT sessions** signed with HS256 algorithm
- **HttpOnly cookies** for session management
- **Role-based access** (admin/partner roles)
- **Audit logging** for authentication events

### API Endpoints

#### POST `/api/auth/login`
Authenticate user and create session.

**Request:**
```json
{
  "username": "aaqil",
  "password": "aaqil123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "username": "aaqil",
    "role": "admin"
  }
}
```

Sets HttpOnly cookie: `vero_session`

#### POST `/api/auth/logout`
Clear user session.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET `/api/auth/me`
Get current authenticated user profile.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "username": "aaqil",
    "role": "admin",
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Protected Routes
The following routes require authentication:
- `/api/chats/*`
- `/api/admin/*`
- `/api/users/*`

## 🏗️ Architecture

### Database Collections

#### `users`
```typescript
{
  username: string,
  passwordHash: string,
  role: 'admin' | 'partner',
  encryptionKey: string,
  createdAt: Date,
  updatedAt: Date,
  lastLogin?: Date
}
```

#### `audit_log`
```typescript
{
  userId: ObjectId,
  action: string,
  timestamp: Date,
  details?: Record<string, any>
}
```

### File Structure
```
src/
├── lib/
│   ├── server/
│   │   ├── auth.ts          # Authentication logic
│   │   ├── mongo.ts         # MongoDB connection
│   │   └── types.ts         # TypeScript interfaces
│   ├── types.ts             # Shared types
│   └── utils.ts             # Utility functions
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/       # POST /api/auth/login
│   │   │   ├── logout/      # POST /api/auth/logout
│   │   │   └── me/          # GET /api/auth/me
│   │   └── chats/           # Protected chat API
│   └── page.tsx             # Main application
├── middleware.ts            # Route protection
└── components/              # React components

scripts/
└── seed-users.ts           # Database seeding script
```

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed:users` - Seed database with default users
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler check

## 🛡️ Security Features

1. **Password Security**
   - Bcrypt hashing with 12 salt rounds
   - No plain text password storage
   - Secure password validation

2. **Session Management**
   - JWT tokens signed with HS256
   - HttpOnly cookies prevent XSS attacks
   - SameSite=strict prevents CSRF
   - 7-day session expiration

3. **Route Protection**
   - Middleware-based authentication
   - Automatic 401 responses for unauthenticated requests
   - Session validation on protected endpoints

4. **Audit Trail**
   - Login events logged to database
   - Timestamp tracking for security events
   - User action monitoring

## 🧪 Testing the Authentication

1. **Login Test:**
```bash
curl -X POST http://localhost:9002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"aaqil","password":"aaqil123"}' \
  -c cookies.txt
```

2. **Protected Route Test:**
```bash
curl http://localhost:9002/api/auth/me \
  -H "Cookie: $(cat cookies.txt | grep vero_session | cut -f7)"
```

3. **Logout Test:**
```bash
curl -X POST http://localhost:9002/api/auth/logout \
  -H "Cookie: $(cat cookies.txt | grep vero_session | cut -f7)"
```

## 🏃‍♂️ Running the Application

1. Ensure MongoDB is running
2. Set up environment variables
3. Seed the database: `npm run seed:users`
4. Start the dev server: `npm run dev`
5. Open `http://localhost:9002` in your browser

The app features a stealth interface that starts as a todo list and unlocks to reveal the chat system when authentication succeeds.

## ⚠️ Production Considerations

1. **Change default passwords** immediately
2. **Use a strong SESSION_SECRET** (at least 32 characters)
3. **Enable HTTPS** in production
4. **Use MongoDB Atlas** or managed database service
5. **Implement rate limiting** on authentication endpoints
6. **Add password complexity requirements**
7. **Enable account lockout** after failed attempts
8. **Add CSRF protection** for state-changing operations

## 🤝 Contributing

This is a development project with authentication and seeding functionality as requested. Future enhancements might include:

- Message encryption
- Real-time chat with WebSockets
- User management interface
- Advanced audit logging
- Multi-factor authentication