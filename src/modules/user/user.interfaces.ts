import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';
import { AccessAndRefreshTokens } from '../token/token.interfaces';

export interface IUser {
  name: string;
  email: string;
  password: string;
  snake_score: number;
  role: string;
  isEmailVerified: boolean;
  menja_score: number;
  score: number;
  color_blast_score: number;
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateUserBody = Partial<IUser>;

export type NewRegisteredUser = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export type NewCreatedUser = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export interface IUserWithTokens {
  user: IUserDoc;
  tokens: AccessAndRefreshTokens;
}
