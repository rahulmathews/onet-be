import express, {Request, Response, NextFunction} from 'express';
import createError from 'http-errors';
import * as _ from 'lodash';

const expenseRouter = express.Router();

import {ExpenseController} from '../controllers';
import {SessionMiddleware, AuthMiddleware} from '../middlewares';
import {ExpenseModel} from '../models';

//Initialize controllers
const expenseController = new ExpenseController();

//Session Middleware
let session = new SessionMiddleware();

//Authentication Middleware
let authMiddleware = new AuthMiddleware();

//Function to extract either the already existing session or create new session
const sessionExtractionFn = async(req:Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    return session.extractExistingSessionOrInitializeNewSession(req, res, next)
}

//Middleware to verfiy the Ids from parameters
const idVerificationMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    try{
        expenseRouter.param('expenseId', function(req, res, next, val){
            if(_.isNil(val)){
                let error = createError(400, 'Expense Id is either null or undefined');
                throw error
            }

            ExpenseModel.findOne({_id : val})
            .then(function(expenseDoc){
                if(!expenseDoc){
                    let error = createError(400, 'Invalid Expense Id');
                    throw error
                }
                _.set(res.locals, 'docs.expenseDoc', expenseDoc);
                return next();
            })
            .catch(function(err){
                next(err);
            })
        })
        return next();
    }
    catch(err){
        next(err);
    }
}

/* Ping Api*/
expenseRouter.get('/ping', function(req, res, next) {
    res.send('pong');
});
  
//Router-level Middlewares

//Id Verfication Middleware
expenseRouter.use(idVerificationMiddleware);

//Category Routes

//Api to get all expenses
expenseRouter.get('/',
    authMiddleware.authJwt,
    sessionExtractionFn,
    (req, res, next) => expenseController.getAllExpenses(req, res, next)
);

//Api to get a single expense
expenseRouter.get('/:expenseId([0-9A-Za-z]{24})',
    authMiddleware.authJwt,
    sessionExtractionFn,
    (req, res, next) => expenseController.getExpense(req, res, next)
);

//Api to add an expense
expenseRouter.post('/',
    authMiddleware.authJwt,
    sessionExtractionFn,
    (req, res, next) => expenseController.addExpense(req, res, next)
);

//Api to update an expense
expenseRouter.post('/:expenseId([0-9A-Za-z]{24})',
    authMiddleware.authJwt,
    sessionExtractionFn,
    (req, res, next) => expenseController.updateExpense(req, res, next)
);

//Api to delete an expense
expenseRouter.delete('/:expenseId([0-9A-Za-z]{24})',
    authMiddleware.authJwt,
    sessionExtractionFn,
    (req, res, next) => expenseController.deleteExpense(req, res, next)
);

export default expenseRouter;