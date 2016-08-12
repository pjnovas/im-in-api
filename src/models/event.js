'use strict';

import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required : true },
  datetime: { type: Date, required : true },
  location: { type: String, required : true },
  info: { type: String },
  max: { type: Number }
  //attendants: {
  //  type : 'array',
  //  defaultsTo: []
  //}
}, { timestamps: true, toJSON: { virtuals: true, versionKey: false } });

export default mongoose.model('Event', EventSchema);
