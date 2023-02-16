import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Contact from './contact.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedContact, UpdateContactBody, IContactDoc } from './contact.interfaces';

/**
 * Create a contact
 * @param {NewCreatedContact} contactBody
 * @returns {Promise<IContactDoc>}
 */
export const createContact = async (contactBody: NewCreatedContact): Promise<IContactDoc> => {
  return Contact.create(contactBody);
};

/**
 * Query for contacts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryContacts = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const contacts = await Contact.paginate(filter, options);
  return contacts;
};

/**
 * Get contact by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IContactDoc | null>}
 */
export const getContactById = async (id: mongoose.Types.ObjectId): Promise<IContactDoc | null> => Contact.findById(id);

/**
 * Get contact by email
 * @param {string} email
 * @returns {Promise<IContactDoc | null>}
 */
export const getContactByEmail = async (email: string): Promise<IContactDoc | null> => Contact.findOne({ email });

/**
 * Update contact by id
 * @param {mongoose.Types.ObjectId} contactId
 * @param {UpdateContactBody} updateBody
 * @returns {Promise<IContactDoc | null>}
 */
export const updateContactById = async (
  contactId: mongoose.Types.ObjectId,
  updateBody: UpdateContactBody
): Promise<IContactDoc | null> => {
  const contact = await getContactById(contactId);
  if (!contact) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found');
  }
  Object.assign(contact, updateBody);
  await contact.save();
  return contact;
};

/**
 * Delete contact by id
 * @param {mongoose.Types.ObjectId} contactId
 * @returns {Promise<IContactDoc | null>}
 */
export const deleteContactById = async (contactId: mongoose.Types.ObjectId): Promise<IContactDoc | null> => {
  const contact = await getContactById(contactId);
  if (!contact) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found');
  }
  await contact.remove();
  return contact;
};
