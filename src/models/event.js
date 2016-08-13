'use strict';

import mongoose from 'mongoose';
import { generate } from 'shortid';

const EventSchema = new mongoose.Schema({
  sid: { type: String, unique: true, default: generate },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required : true },
  datetime: { type: Date, required : true },
  location: { type: String, required : true },
  info: { type: String },
  max: { type: Number },
  attendants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true, toJSON: { virtuals: true, versionKey: false } });

export default mongoose.model('Event', EventSchema);
