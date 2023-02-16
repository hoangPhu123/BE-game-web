import Joi from 'joi';
import { password, objectId } from '../validate/custom.validation';
import { NewCreatedContact } from './contact.interfaces';

const createContactBody: Record<keyof NewCreatedContact, any> = {
  email: Joi.string().required().email(),
  name: Joi.string().required(),
  phone: Joi.string(),
  title: Joi.string(),
  message: Joi.string(),
};

export const createContact = {
  body: Joi.object().keys(createContactBody),
};

export const getContacts = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getContact = {
  params: Joi.object().keys({
    contactId: Joi.string().custom(objectId),
  }),
};

export const updateContact = {
  params: Joi.object().keys({
    contactId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

export const deleteContact = {
  params: Joi.object().keys({
    contactId: Joi.string().custom(objectId),
  }),
};
