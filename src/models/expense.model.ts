import mongoose, { Model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

import { IExpenseDoc } from '../interfaces';

const ExpenseSchema = new mongoose.Schema<IExpenseDoc>({
    name : {
        type : String,
        required : true,
        lowercase : true
    },
    categoryId : {type : Schema.Types.ObjectId, ref: 'Category'},
    amount : {type : Number}
}, {timestamps : true});

//Schema setters
ExpenseSchema.set('toJSON', {
    transform : function(doc, ret){
        delete ret.__v;
    }
})

//plugins
ExpenseSchema.plugin(mongoosePaginate);

//methods

//Method to save/insert expenses
ExpenseSchema.statics.insertExpense = async(userObj : any) =>{
    return ExpenseModel.create(userObj);
}

//Method to search for any query
ExpenseSchema.statics.search = async(searchQuery : any, options: any) => {
    //@ts-ignore
    return ExpenseModel.paginate(searchQuery, options);
    // return UserModel.find(searchQuery);
}

//Method to search for single document
ExpenseSchema.statics.searchOne = async(searchQuery : any) => {
    return ExpenseModel.findOne(searchQuery);
}

//Method to update a single document
ExpenseSchema.statics.updateOne = async(searchQuery : any, updateQuery : any) => {
    return ExpenseModel.findOneAndUpdate(searchQuery, updateQuery);
}

//Method to remove a single document
ExpenseSchema.statics.deleteOne = async(searchQuery : any) => {
    return ExpenseModel.findOneAndRemove(searchQuery);
}

interface IExpenseModel extends Model<IExpenseDoc> {
    insertExpense : (userObj : any) => Promise<IExpenseDoc>;
    search : (searchQuery : any, options: any) => Promise<IExpenseDoc[]>;
    searchOne : (searchQuery : any) => Promise<IExpenseDoc>;
    updateOne : (searchQuery : any, updateQuery : any) => any;
    deleteOne : (searchQuery : any) => any;
};

export const ExpenseModel = mongoose.model<IExpenseDoc, IExpenseModel>('Expense', ExpenseSchema);
