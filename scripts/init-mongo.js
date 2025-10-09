// MongoDB initialization script
db = db.getSiblingDB('justeunpeu');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'passwordHash', 'createdAt'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
          description: 'must be a valid email'
        },
        passwordHash: {
          bsonType: 'string',
          minLength: 1,
          description: 'must be a string and is required'
        },
        emailVerifiedAt: {
          bsonType: ['date', 'null'],
          description: 'must be a date or null'
        },
        createdAt: {
          bsonType: 'date',
          description: 'must be a date'
        },
        updatedAt: {
          bsonType: 'date',
          description: 'must be a date'
        }
      }
    }
  }
});

db.createCollection('password_resets', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'tokenHash', 'expiresAt', 'createdAt'],
      properties: {
        userId: {
          bsonType: 'objectId',
          description: 'must be an objectId'
        },
        tokenHash: {
          bsonType: 'string',
          description: 'must be a string'
        },
        expiresAt: {
          bsonType: 'date',
          description: 'must be a date'
        },
        usedAt: {
          bsonType: ['date', 'null'],
          description: 'must be a date or null'
        },
        createdAt: {
          bsonType: 'date',
          description: 'must be a date'
        }
      }
    }
  }
});

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: 1 });
db.users.createIndex({ emailVerifiedAt: 1 });

db.password_resets.createIndex({ userId: 1 });
db.password_resets.createIndex({ tokenHash: 1 });
db.password_resets.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

print('Database initialized with collections and indexes');