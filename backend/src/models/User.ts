import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  status?: string;
}

const userSchema: Schema<IUser> = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, default: 'not' },
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;