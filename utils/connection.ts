// IMPORT MONGOOSE
import mongoose from 'mongoose';

// CONNECTING TO MONGOOSE (Get Database Url from .env.local)
const { DATABASE_URL } = process.env;

// connection function
export const connect = async () => {
  const conn = await mongoose
    .connect(DATABASE_URL as string)
    .catch((err) => console.log(err));
  console.log('Mongoose Connection Established');

  // OUR USER SCHEMA
  const UserSchema = new mongoose.Schema({
    name: String,
    points: Number,
    current_gp: Number,
  });

  const RaceSchema = new mongoose.Schema({
    race: String,
    flag: String,
    date: Date,
    track: String,
    number: Number,
    bonus_question: String,
  });

  const DriverSchema = new mongoose.Schema({
    name: String,
    racenumber: Number,
  });

  const PredictionSchema = new mongoose.Schema({
    user: String,
    kwali: [Number],
    race: [Number],
    bonus: Number,
    number: Number,
  });

  const RaceResultSchema = new mongoose.Schema({
    number: Number,
    kwali: [Number],
    race: [Number],
    bonus: Number,
  });

  // OUR USER MODEL
  const User =
    mongoose.models.User || (mongoose.model('User', UserSchema) as any);
  const Race =
    mongoose.models.Race || (mongoose.model('Race', RaceSchema) as any);
  const Driver =
    mongoose.models.Driver || (mongoose.model('Driver', DriverSchema) as any);
  const Prediction =
    mongoose.models.Prediction ||
    (mongoose.model('Prediction', PredictionSchema) as any);
  const RaceResult =
    mongoose.models.RaceResult ||
    (mongoose.model('RaceResult', RaceResultSchema) as any);

  return { conn, User, Race, Driver, Prediction, RaceResult };
};
