import mongoose, { Model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

import { ICategoryDoc } from '../interfaces';

const CategorySchema = new mongoose.Schema<ICategoryDoc>({
    name : {
        type : String,
        required : true,
        lowercase : true
    },
    userId : {type : Schema.Types.ObjectId, ref: 'User'},
    expenses : [{type : Schema.Types.ObjectId}],
    total : {type: Number}
    
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
    //@ts-ignore
    return CategoryModel.paginate(searchQuery, options);
    // return UserModel.find(searchQuery);
}

//Method to search for single document
CategorySchema.statics.searchOne = async(searchQuery : any) => {
    return CategoryModel.findOne(searchQuery);
}

//Method to update a single document
CategorySchema.statics.updateOne = async(searchQuery : any, updateQuery : any) => {
    return CategoryModel.findOneAndUpdate(searchQuery, updateQuery);
}

//Method to remove a single document
CategorySchema.statics.deleteOne = async(searchQuery : any) => {
    return CategoryModel.findOneAndRemove(searchQuery);
}

interface ICategoryModel extends Model<ICategoryDoc> {
    insertCategory : (userObj : any) => Promise<ICategoryDoc>;
    search : (searchQuery : any, options: any) => Promise<ICategoryDoc[]>;
    searchOne : (searchQuery : any) => Promise<ICategoryDoc>;
    updateOne : (searchQuery : any, updateQuery : any) => any;
    deleteOne : (searchQuery : any) => any;
};

export const CategoryModel = mongoose.model<ICategoryDoc, ICategoryModel>('Category', CategorySchema);
