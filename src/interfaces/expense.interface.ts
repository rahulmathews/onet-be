import {Document, Schema} from 'mongoose';

export interface IExpense{
    name: string;
    categoryId : Schema.Types.ObjectId;
    userId : Schema.Types.ObjectId;
    amount: number;
}

export interface IExpenseDoc extends IExpense, Document {
    _id: Schema.Types.ObjectId
};