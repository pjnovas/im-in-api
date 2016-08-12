
'use strict';

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String },
  token: { type: String }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
