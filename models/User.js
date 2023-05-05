import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    userType: { type: String, required: true, default: 'normal' },
    isActiveUser: { type: Boolean, required: true, unique: false, default: true },
    // channel: { type: String, required: true, unique: false, default: 'direct' },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
