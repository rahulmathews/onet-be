import mongoose, { Model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import * as _ from 'lodash';

import { ICategoryDoc } from '../interfaces';

const CategorySchema = new mongoose.Schema<ICategoryDoc>({
    name : {
        type : String,
        required : true,
        lowercase : true
    },
    userId : {type : Schema.Types.ObjectId, ref: 'User'},
    expenses : [{
        expenseId : {type : Schema.Types.ObjectId, ref: 'Expense'},
        deleted : {type : Boolean, default : false}
    }],
    total : {type: Number},
    deleted : {type : Boolean, default: false}
    
}, {timestamps : true});

//Schema setters
CategorySchema.set('toJSON', {
    transform : function(doc, ret){
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
    }
})

//plugins
CategorySchema.plugin(mongoosePaginate);

//methods

//Method to save/insert categories
CategorySchema.statics.insertCategory = async(userObj : any) =>{
    return CategoryModel.create(userObj);
}

//Method to search for any query
CategorySchema.statics.search = async(searchQuery : any, options: any) => {
    searchQuery = _.assign(searchQuery, {'deleted' : false});
    //@ts-ignore
    return CategoryModel.paginate(searchQuery, options);
    // return UserModel.find(searchQuery);
}

//Method to search for single document
CategorySchema.statics.searchOne = async(searchQuery : any, options?: any) => {
    searchQuery = _.assign(searchQuery, {'deleted' : false});
    return CategoryModel.findOne(searchQuery).populate(options);
}

//Method to update a single document
CategorySchema.statics.updateOne = async(searchQuery : any, updateQuery : any) => {
    return CategoryModel.findOneAndUpdate(searchQuery, updateQuery, {new : true});
}

//Method to remove a single document
CategorySchema.statics.deleteOne = async(searchQuery : any) => {
    // return CategoryModel.findOneAndRemove(searchQuery);
    return CategoryModel.findOneAndUpdate(searchQuery, {
        $set : {
            'deleted' : true
        },
    });
}

interface ICategoryModel extends Model<ICategoryDoc> {
    insertCategory : (userObj : any) => Promise<ICategoryDoc>;
    search : (searchQuery : any, options: any) => Promise<any>;
    searchOne : (searchQuery : any, options?: any) => Promise<ICategoryDoc>;
    updateOne : (searchQuery : any, updateQuery : any) => any;
    deleteOne : (searchQuery : any) => any;
};

export const CategoryModel = mongoose.model<ICategoryDoc, ICategoryModel>('Category', CategorySchema);
