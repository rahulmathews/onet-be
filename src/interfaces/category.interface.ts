import {Document, Schema} from 'mongoose';

export interface ICategory{
    name: string;
    userId: Schema.Types.ObjectId;
    expenses: Array<Schema.Types.ObjectId>;
    total: number
}

export interface ICategoryDoc extends ICategory, Document {
    _id: Schema.Types.ObjectId
};