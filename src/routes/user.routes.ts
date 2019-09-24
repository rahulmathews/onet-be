import express, {Request, Response, NextFunction} from 'express';
const userRouter = express.Router();
import createError from 'http-errors';
import * as _ from 'lodash';

import categoryRouter from './category.routes';
import {UserModel} from '../models';

//Middleware to verfiy the Ids from parameters
const idVerificationMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    try{
        userRouter.param('userId', function(req, res, next, val){
            if(_.isNil(val)){
                let error = createError(400, 'User Id is either null or undefined');
                throw error
            }

            UserModel.findOne({_id : val})
            .then(function(userDoc){
                if(!userDoc){
                    let error = createError(400, 'Invalid User Id');
                    throw error
                }
                _.set(res.locals, 'docs.userDoc', userDoc);
                // res.locals.userDoc = userDoc;
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
userRouter.get('/ping', function(req, res, next) {
  res.send('pong');
});

//Router-level Middlewares

//Id Verfication Middleware
userRouter.use(idVerificationMiddleware);

//User Routes


//Category Routes
userRouter.use('/:userId([0-9A-Za-z]{24})/categories', 
    (req:any, res, next) => {
        //@ts-ignore
        _.set(res.locals, 'params', req.params);
        // req.paramsRetained = req.params;
        next();
    },
    categoryRouter
);

export default userRouter;
