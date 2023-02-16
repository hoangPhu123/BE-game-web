import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as contactService from './contact.service';

export const createContact = catchAsync(async (req: Request, res: Response) => {
  const contact = await contactService.createContact(req.body);
  res.status(httpStatus.CREATED).send(contact);
});

export const getContacts = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await contactService.queryContacts(filter, options);
  res.send(result);
});

export const getContact = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['contactId'] === 'string') {
    const contact = await contactService.getContactById(new mongoose.Types.ObjectId(req.params['contactId']));
    if (!contact) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found');
    }
    res.send(contact);
  }
});

export const updateContact = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['contactId'] === 'string') {
    const contact = await contactService.updateContactById(new mongoose.Types.ObjectId(req.params['contactId']), req.body);
    res.send(contact);
  }
});

export const deleteContact = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['contactId'] === 'string') {
    await contactService.deleteContactById(new mongoose.Types.ObjectId(req.params['contactId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
