import { getDb } from '../src/lib/server/mongo';
import { hashPassword } from '../src/lib/server/auth';
import { User } from '../src/lib/server/types';

// Define the users to seed
const USERS_TO_SEED: Array<{
  username: string;
  password: string;
  role: 'admin' | 'partner';
  encryptionKey: string;
}> = [
  {
    username: 'aaqil',
    password: 'aaqil123', // This should be changed in production
    role: 'admin',
    encryptionKey: 'placeholder-encryption-key-aaqil'
  },
  {
    username: 'roshini',
    password: 'roshini123', // This should be changed in production
    role: 'partner',
    encryptionKey: 'placeholder-encryption-key-roshini'
  }
];

async function seedUsers() {
  console.log('🔄 Starting user seeding process...');
  
  try {
    const db = await getDb();
    console.log('✅ Connected to MongoDB');

    // Create indexes for better performance
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    console.log('✅ Created unique index on username');

    const now = new Date();
    const seedResults = [];

    for (const userData of USERS_TO_SEED) {
      console.log(`🔄 Processing user: ${userData.username}`);
      
      const passwordHash = await hashPassword(userData.password);
      
      const user: Partial<User> = {
        username: userData.username,
        passwordHash,
        role: userData.role,
        encryptionKey: userData.encryptionKey,
        createdAt: now,
        updatedAt: now
      };

      // Upsert user (insert or update if exists)
      const result = await db.collection<User>('users').findOneAndUpdate(
        { username: userData.username },
        {
          $set: {
            passwordHash: user.passwordHash,
            role: user.role,
            encryptionKey: user.encryptionKey,
            updatedAt: now
          },
          $setOnInsert: {
            createdAt: now
          }
        },
        {
          upsert: true,
          returnDocument: 'after'
        }
      );

      if (result) {
        seedResults.push({
          username: userData.username,
          role: userData.role,
          status: result ? 'created/updated' : 'failed'
        });
        console.log(`✅ User '${userData.username}' (${userData.role}) ${result ? 'created/updated' : 'failed'}`);
      } else {
        seedResults.push({
          username: userData.username,
          role: userData.role,
          status: 'failed'
        });
        console.log(`❌ Failed to create/update user '${userData.username}'`);
      }
    }

    // Print summary
    console.log('\n📊 Seeding Summary:');
    console.log('==================');
    seedResults.forEach(result => {
      console.log(`- ${result.username} (${result.role}): ${result.status}`);
    });

    // Verify users were created
    const userCount = await db.collection<User>('users').countDocuments({
      username: { $in: USERS_TO_SEED.map(u => u.username) }
    });

    if (userCount === USERS_TO_SEED.length) {
      console.log(`\n🎉 Successfully seeded ${userCount} users!`);
      console.log('\n🔑 Default Credentials:');
      console.log('- aaqil (admin): aaqil123');
      console.log('- roshini (partner): roshini123');
      console.log('\n⚠️  Please change these passwords in production!');
    } else {
      throw new Error(`Expected ${USERS_TO_SEED.length} users, but found ${userCount}`);
    }

  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
}

// Run the seeding function
if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log('✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export { seedUsers };