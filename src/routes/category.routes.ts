import express, {Request, Response, NextFunction} from 'express';
import createError from 'http-errors';
import * as _ from 'lodash';

const catergoryRouter = express.Router();

import {CategoryController} from '../controllers';
import {SessionMiddleware, AuthMiddleware} from '../middlewares';
import {CategoryModel} from '../models';

//Initialize controllers
const categoryController = new CategoryController();

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
        catergoryRouter.param('categoryId', function(req, res, next, val){
            if(_.isNil(val)){
                let error = createError(400, 'Category Id is either null or undefined');
                throw error
            }

            CategoryModel.findOne({_id : val})
            .then(function(categoryDoc){
                if(!categoryDoc){
                    let error = createError(400, 'Invalid Category Id');
                    throw error
                }
                _.set(res.locals, 'categoryDoc', categoryDoc);
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
catergoryRouter.get('/ping', function(req, res, next) {
    res.send('pong');
});
  
//Router-level Middlewares

//Id Verfication Middleware
catergoryRouter.use(idVerificationMiddleware);

//Category Routes

//Api to get all categories
catergoryRouter.get('/',
    authMiddleware.authJwt,
    sessionExtractionFn,
    (req, res, next) => categoryController.getAllCategories(req, res, next)
);

//Api to get a single category
catergoryRouter.get('/:categoryId([0-9A-Za-z]{24})',
    authMiddleware.authJwt,
    sessionExtractionFn,
    (req, res, next) => categoryController.getCategory(req, res, next)
);

//Api to add a new category
catergoryRouter.post('/',
    authMiddleware.authJwt,
    sessionExtractionFn,
    (req, res, next) => categoryController.addCategory(req, res, next)
);

//Api to update a single category
catergoryRouter.post('/:categoryId([0-9A-Za-z]{24})',
    authMiddleware.authJwt,
    sessionExtractionFn,
    (req, res, next) => categoryController.updateCategory(req, res, next)
);

//Api to delete category
catergoryRouter.delete('/:categoryId([0-9A-Za-z]{24})',
    authMiddleware.authJwt,
    sessionExtractionFn,
    (req, res, next) => categoryController.deleteCategory(req, res, next)
);


export default catergoryRouter;