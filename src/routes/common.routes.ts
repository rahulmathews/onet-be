import express, {Request, Response, NextFunction} from 'express';
import createError from 'http-errors';
import * as _ from 'lodash';

const commonRouter = express.Router();

import {CommonController} from '../controllers';
import {SessionMiddleware, AuthMiddleware} from '../middlewares';
import {UserModel} from '../models';

//Initialize controllers
const commonController = new CommonController();

//Session Middleware
let session = new SessionMiddleware();

//Authentication Middleware
let authMiddleware = new AuthMiddleware();

//Function to extract either the already existing session or create new session
const sessionExtractionFn = async(req:Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    return session.extractExistingSessionOrInitializeNewSession(req, res, next)
}

//Function to delete existing session 
const sessionInvalidationFn = async(req:Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    return session.invalidateSession(req, res, next);
}

//Middleware to verfiy the Ids from parameters
const idVerificationMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    try{
        commonRouter.param('userId', function(req, res, next, val){
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
                return next();
            })
            .catch(function(err){
                throw err;
            })
        })
        return next();
    }
    catch(err){
        next(err);
    }
}

/* Ping Api*/
commonRouter.get('/ping', function(req, res, next) {
  res.send('pong');
});

//Router-level Middlewares

//Id Verfication Middleware
commonRouter.use(idVerificationMiddleware);

/* Register Api*/
commonRouter.post('/register', commonController.registerUser);

/* Login Api*/
commonRouter.post('/login', 
    authMiddleware.authLocal,
    sessionExtractionFn,
    (req, res, next) => commonController.loginUser(req, res, next)
);

/* Change Password Api*/
commonRouter.post('/changepassword', 
    authMiddleware.authJwt,
    sessionExtractionFn,
    (req, res, next) => commonController.changePwd(req, res, next)
);

/* Logout Api*/
commonRouter.post('/logout', authMiddleware.authJwt,
    sessionExtractionFn,
    sessionInvalidationFn,
    (req, res, next) => commonController.logoutUser(req, res, next)
)


export default commonRouter;
