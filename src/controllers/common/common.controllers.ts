import {Request, Response, NextFunction} from 'express';
import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';
import createError from 'http-errors';

import {UserModel} from '../../models';
import {IUser} from '../../interfaces';

export class CommonController{

    constructor(){

    }

    registerUser = async(req : Request, res : Response, next : NextFunction) => {
        try{
            const {username, password, occupation, email, phone, address} = _.get(req, 'body');
            if(_.isNil(_.get(req.body, 'username'))){
                let err = createError(400, 'username is either null or undefined');
                return next(err);
            };
            
            if(_.isNil(_.get(req.body, 'password'))){
                let err = createError(400, 'password is either null or undefined');
                return next(err);
            }

            if(_.isNil(_.get(req.body, 'email'))){
                let err = createError(400, 'email is either null or undefined');
                return next(err);
            }

            if(_.isNil(_.get(req.body, 'phone'))){
                let err = createError(400, 'phone is either null or undefined');
                return next(err);
            }

            if(_.isNil(_.get(req.body, 'address'))){
                let err = createError(400, 'address is either null or undefined');
                return next(err);
            }

            const saltRounds = parseInt(process.env.AUTH_SALT_ROUNDS) || 10;
            const hashedPwd = await bcrypt.hash(password, saltRounds);
            
            let insertObj: IUser = {
                username : username,
                password : hashedPwd,
                occupation : occupation,
                emails : [{
                    value : email,
                    primary : true
                }],
                phones : [{
                    value : phone,
                    primary : true
                }],
                address : address
            };

            let userDoc = await UserModel.insertUser(insertObj);
            if(userDoc){
                return res.status(200).json({message : 'Registered Successfully'});
            }
            else{
                return res.status(204).json({message : 'Registration Failed'});
            }
        }
        catch(err){
            next(err);
        }
    }

}