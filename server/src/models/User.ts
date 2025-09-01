import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  email: string;
  password?: string; // optional because OAuth users may not have password
  googleId?: string; // store Google account ID for OAuth
  createdAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  googleId: { type: String, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;