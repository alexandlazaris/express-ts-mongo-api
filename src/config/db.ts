// import mongoose from "mongoose";
// // import { MongoClient, Db } from 'mongodb';
// // let cachedClient: MongoClient | null = null;
// // let cachedDb: Db | null = null;

// const MONGO_URI = process.env.MONGO_URI || '';

// export const connectDB = async () => {
//     try {
//         await mongoose.connect(MONGO_URI);
//         console.log('Mongodb connected');
//     }
//     catch (error) {
//         console.log(MONGO_URI);
//         console.error('mongodb connection failed:', error);
//         process.exit(1);
//     }
// };


// // export async function connectDB(): Promise<Db> {

// // if (cachedDb) {
// //     console.log('returning to cached db');
// //     return cachedDb;
// // }
// // const MONGO_URI = process.env.MONGO_URI;
// // if (!MONGO_URI) {
// //     throw new Error('mongo db uri not found in .env');
// // }

// // cachedClient = new MongoClient(MONGO_URI);
// // console.log('connecting to db');
// // await cachedClient.connect();
// // console.log('connected to db');
// // const dbName = process.env.DB_NAME || 'test';
// // cachedDb = cachedClient.db(dbName);
// // return cachedDb;
// // }

import mongoose from 'mongoose';

export interface MongoDb {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  ping(): Promise<boolean>;
}

// const MONGO_URI = process.env.MONGO_URI ?? '';

export const mongoDb: MongoDb = {
  async connect() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI not set');
    }
    if (mongoose.connection.readyState === 1) return;

    await mongoose.connect(uri);
    console.log('MongoDB connected');
  },

  async disconnect() {
    await mongoose.disconnect();
  },

  async ping() {
    return mongoose.connection.readyState === 1;
  },
};
