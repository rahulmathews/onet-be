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
                paginateOptions.populate = 'userId';
            }

            let searchQuery = {
                userId : userId
            };

            let categoryDocs = await CategoryModel.search(searchQuery, paginateOptions);
            if(categoryDocs){
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
}