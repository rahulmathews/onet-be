import {Request, Response, NextFunction} from 'express';
import * as _ from 'lodash';
import createError from 'http-errors';

import {ExpenseModel, CategoryModel} from '../../models';
import {IExpense} from '../../interfaces';

export class ExpenseController{

    constructor(){

    }

    addExpense = async(req : Request, res : Response, next : NextFunction) => {
        try{
            let {name, amount} = _.get(req, 'body');

            if(_.isNil(_.get(req.body, 'name'))){
                let err = createError(400, 'name is either null or undefined');
                return next(err);
            };

            if(_.isNil(_.get(req.body, 'amount'))){
                let err = createError(400, 'amount is either null or undefined');
                return next(err);
            };

            amount = parseFloat(amount);
            let categoryId = _.get(res.locals, 'params.categoryId');
            let userId = _.get(res.locals, 'params.userId');

            let insertObj: IExpense = {
                name : name,
                categoryId : categoryId,
                userId : userId,
                amount : amount
            };

            let expenseDoc = await ExpenseModel.insertExpense(insertObj);
            if(expenseDoc){
                let updateQuery = {
                    $inc : {
                        total : amount
                    },
                    $push : {
                        expenses : expenseDoc.id
                    }
                }
                let categoryDoc = await CategoryModel.updateOne({_id: categoryId}, updateQuery);
                if(categoryDoc){
                    return res.status(200).json({message : 'Expense Added Successfully'});
                }
                else{
                    return res.status(204).json({message : 'Expense Addition Failed'});
                }
            }
            else{
                return res.status(204).json({message : 'Expense Addition Failed'});
            }
        }
        catch(err){
            next(err);
        }
    }

    getAllExpenses = async(req : Request, res : Response, next : NextFunction) => {
        try{

            let userId = _.get(res.locals, 'params.userId');
            let categoryId = _.get(res.locals, 'params.categoryId');

            let populateUser = _.get(req.query, 'populateUser') === 'true' ? true : false;
            let populateCategory = _.get(req.query, 'populateCategory') === 'true' ? true : false;

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

            if(populateCategory){
                paginateOptions.populate.push('categoryId');
            }

            let searchQuery = {
                userId : userId,
                categoryId : categoryId
            };

            let expenseDocs = await ExpenseModel.search(searchQuery, paginateOptions);
            if(!_.isEmpty(expenseDocs.docs)){
                return res.status(200).json({message : 'Data Found', data : expenseDocs});
            }
            else{
                return res.status(204).json({message : 'Data not Found'});
            }
        }
        catch(err){
            next(err);
        }
    }

    getExpense = async(req : Request, res : Response, next : NextFunction) => {
        try{
            const expenseId = req.params.expenseId;
            let categoryId = _.get(res.locals, 'params.categoryId');
            let userId = _.get(res.locals, 'params.userId');


            let populateUser = _.get(req.query, 'populateUser') === 'true' ? true : false;
            let populateCategory = _.get(req.query, 'populateCategory') === 'true' ? true : false;

            let searchObj = { 
                categoryId : categoryId,
                userId : userId,
                _id : expenseId
            };
            let paginateOptions = [];

            if(populateUser){
                paginateOptions.push({
                    path : 'userId'
                })
            }

            if(populateCategory){
                paginateOptions.push({
                    path : 'categoryId'
                })
            }

            let expenseDoc = await ExpenseModel.searchOne(searchObj, paginateOptions);
            if(expenseDoc){
                return res.status(200).json({message : 'Data Found', data : expenseDoc});
            }
            else{
                return res.status(204).json({message : 'Data not Found'});
            }
        }
        catch(err){
            next(err);
        }
    }

    updateExpense = async(req : Request, res : Response, next : NextFunction) => {
        try{
            let {name, amount} = _.get(req, 'body');

            const expenseId = req.params.expenseId;
            let categoryId = _.get(res.locals, 'params.categoryId');
            let userId = _.get(res.locals, 'params.userId');

            let searchObj = { 
                categoryId : categoryId,
                userId : userId,
                _id : expenseId
            };

            amount = parseFloat(amount);

            let updateQuery = {
                $set : {
                    name : name,
                    amount : amount
                }
            }

            Object.keys(updateQuery.$set).forEach((key) => {
                if(!updateQuery.$set[key]){
                    delete updateQuery.$set[key]
                }
            })
            
            let expenseDoc = await ExpenseModel.updateOne(searchObj, updateQuery);
            if(expenseDoc){
                let valToBeUpdated = 
                (expenseDoc.amount - res.locals.docs.expenseDoc.amount);
                let updateQuery = {
                    $inc : {
                        total : valToBeUpdated
                    }
                };

                let categoryDoc = await CategoryModel.updateOne({_id: categoryId}, updateQuery);
                if(categoryDoc){
                    return res.status(200).json({message : 'Expense Updated Successfully'});
                }
                else{
                    return res.status(204).json({message : 'Expense Updation Failed'});
                }
            }
            else{
                return res.status(204).json({message : 'Expense Updation Failed'});
            }
        }
        catch(err){
            next(err);
        }
    }

    deleteExpense = async(req : Request, res : Response, next : NextFunction) => {
        try{
            const expenseId = req.params.expenseId;
            let userId = _.get(res.locals, 'params.userId');
            let categoryId = _.get(res.locals, 'params.categoryId');

            let deleteObj = { 
                userId : userId,
                categoryId : categoryId,
                _id : expenseId
            };

            let expenseDoc = await ExpenseModel.deleteOne(deleteObj);
            if(expenseDoc){
                let updatedAmount = expenseDoc.amount * -1;
                let updateQuery = {
                    $inc : {
                        total : updatedAmount
                    }
                };

                let categoryDoc = await CategoryModel.updateOne({_id: categoryId}, updateQuery);
                if(categoryDoc){
                    return res.status(200).json({message : 'Expense deleted Successfully'});
                }
                else{
                    return res.status(204).json({message : 'Expense Deletion Failed'});
                }
            }
            else{
                return res.status(204).json({message : 'Expense Deletion Failed'});
            }
        }
        catch(err){
            next(err);
        }
    }
}