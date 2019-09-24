import {Request, Response, NextFunction} from 'express';
import * as _ from 'lodash';
import createError from 'http-errors';

import {CategoryModel} from '../../models';
import {ICategory} from '../../interfaces';

export class CategoryController{

    constructor(){

    }

    addCategory = async(req : Request, res : Response, next : NextFunction) => {
        try{
            const {name} = _.get(req, 'body');

            if(_.isNil(_.get(req.body, 'name'))){
                let err = createError(400, 'name is either null or undefined');
                return next(err);
            };

            let userId = _.get(res.locals, 'params.userId');

            let insertObj: ICategory = {
                name : name,
                userId : userId,
                total : 0
            };

            let categoryDoc = await CategoryModel.insertCategory(insertObj);
            if(categoryDoc){
                return res.status(200).json({message : 'Category Added Successfully'});
            }
            else{
                return res.status(204).json({message : 'Category Addition Failed'});
            }
        }
        catch(err){
            next(err);
        }
    }

    getAllCategories = async(req : Request, res : Response, next : NextFunction) => {
        try{

            let userId = _.get(res.locals, 'params.userId');
            let populateUser = _.get(req.query, 'populateUser') === 'true' ? true : false;
            let populateExpense = _.get(req.query, 'populateExpense') === 'true' ? true : false;

            let reqQuery = _.get(req, 'query');
            let page = 1;
            let limit = 10;
            
            if(!_.isEmpty(reqQuery)){
                page = _.get(reqQuery, 'page', 1);
                limit = _.get(reqQuery, 'limit', 10);
            }
            
            let paginateOptions: any = {
                page : page,
                limit : limit,
                populate : []
            };

            if(populateUser){
                paginateOptions.populate.push('userId');
            }

            if(populateExpense){
                paginateOptions.populate.push('expenses');
            }

            let searchQuery = {
                userId : userId
            };

            let categoryDocs = await CategoryModel.search(searchQuery, paginateOptions);
            if(!_.isEmpty(categoryDocs.docs)){
                return res.status(200).json({message : 'Data Found', data : categoryDocs});
            }
            else{
                return res.status(204).json({message : 'Data not Found'});
            }
        }
        catch(err){
            next(err);
        }
    }

    getCategory = async(req : Request, res : Response, next : NextFunction) => {
        try{
            const categoryId = req.params.categoryId;
            let userId = _.get(res.locals, 'params.userId');
            const reqQuery = _.get(req, 'query');
            let populateUser = _.get(req.query, 'populateUser') === 'true' ? true : false;
            let populateExpense = _.get(req.query, 'populateExpense') === 'true' ? true : false;

            let searchObj = { 
                userId : userId,
                _id : categoryId
            };
            let paginateOptions = [];

            if(populateUser){
                paginateOptions.push({
                    path : 'userId'
                })
            }

            if(populateExpense){
                paginateOptions.push({
                    path : 'expenses'
                })
            }

            let categoryDoc = await CategoryModel.searchOne(searchObj, paginateOptions);
            if(categoryDoc){
                return res.status(200).json({message : 'Data Found', data : categoryDoc});
            }
            else{
                return res.status(204).json({message : 'Data not Found'});
            }
        }
        catch(err){
            next(err);
        }
    }

    deleteCategory = async(req : Request, res : Response, next : NextFunction) => {
        try{
            const categoryId = req.params.categoryId;
            let userId = _.get(res.locals, 'params.userId');

            let deleteObj = { 
                userId : userId,
                _id : categoryId
            };

            let categoryDoc = await CategoryModel.deleteOne(deleteObj);
            if(categoryDoc){
                return res.status(200).json({message : 'Category deleted Successfully'});
            }
            else{
                return res.status(204).json({message : 'Category Deletion Failed'});
            }
        }
        catch(err){
            next(err);
        }
    }

    updateCategory = async(req : Request, res : Response, next : NextFunction) => {
        try{
            const {name} = _.get(req, 'body');

            const categoryId = req.params.categoryId;
            let userId = _.get(res.locals, 'params.userId');

            let searchObj = {
                userId : userId,
                _id : categoryId
            };

            let updateObj = {
                $set : {
                    name : name
                }
            };

            Object.keys(updateObj.$set).forEach((key) => {
                if(!updateObj.$set[key]){
                    delete updateObj.$set[key]
                }
            })

            let categoryDoc = await CategoryModel.updateOne(searchObj, updateObj);
            if(categoryDoc){
                return res.status(200).json({message : 'Category Updated Successfully'});
            }
            else{
                return res.status(204).json({message : 'Category Updation Failed'});
            }
        }
        catch(err){
            next(err);
        }
    }
}