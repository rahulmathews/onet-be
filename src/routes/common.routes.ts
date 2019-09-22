import express from 'express';
const commonRouter = express.Router();

import {CommonController} from '../controllers';

//Initialize controllers
const commonController = new CommonController();

/* Ping Api*/
commonRouter.get('/ping', function(req, res, next) {
  res.send('pong');
});

/* Register Api*/
commonRouter.post('/register', commonController.registerUser);

/* Login Api*/
commonRouter.get('/login', function(req, res, next) {
	res.send('pong');
});

/* Change Password Api*/
commonRouter.get('/changepassword', function(req, res, next) {
	res.send('pong');
});

/* Logout Api*/
commonRouter.get('/logout', function(req, res, next) {
	res.send('pong');
});


export default commonRouter;
