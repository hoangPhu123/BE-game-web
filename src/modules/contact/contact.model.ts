import mongoose from 'mongoose';
import validator from 'validator';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IContactDoc, IContactModel } from './contact.interfaces';

const contactSchema = new mongoose.Schema<IContactDoc, IContactModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      // unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
contactSchema.plugin(toJSON);
contactSchema.plugin(paginate);

contactSchema.pre('save', async function (next) {
  next();
});

const Contact = mongoose.model<IContactDoc, IContactModel>('Contact', contactSchema);

export default Contact;
