import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  
  username: { type: String, required: true, unique: true },
  slug:{ type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, default: 'https://th.bing.com/th/id/OIP.wMVFPrjUi0TTHwglYJl83QAAAA?w=162&h=204&c=7&r=0&o=5&dpr=1.3&pid=1.7' },
  password: { type: String, select: false },
  bio: { type: String, default: 'A Newbie Author' },
  accountType: { type: String, enum: ['Simple', 'Business'], default: 'Simple' },
  country: { type: String, default: 'null' },

  // for security of account
  verifyedUser: { type: Boolean, default: false },
  emailToken: { type: String, default: null },


  achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'achievements' }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'blogs' }],
 

  refreshToken: { type: String, default: null },

  lastLogin: { type: Date, default: Date.now },

  lastPasswordChange: { type: Date },
 
}, { timestamps: true });


UserSchema.pre("save", async function (next) {

  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.lastPasswordChange = Date.now();
  }
  
  next();
});

export const USER_MODEL = mongoose.model('users', UserSchema);

