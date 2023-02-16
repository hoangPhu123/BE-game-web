import { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IContact {
  name: string;
  email: string;
  phone: string;
  title: string;
  message: string;
}

export interface IContactDoc extends IContact, Document {}

export interface IContactModel extends Model<IContactDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateContactBody = Partial<IContact>;
export type NewCreatedContact = Partial<IContact>;
