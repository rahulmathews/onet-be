import express, {Express} from 'express';
import createError from 'http-errors';

import router from './routes';
import {ErrorHandlerUtil} from './utils';

export class App{
  private app: Express;

  constructor(){

    try{
      //Main Express App Module
      this.app = express();

      //Third Party middlewares
      this.app.use(express.json());
      this.app.use(express.urlencoded({ extended: false }));

      //Initialize Router 
      this.app.use('/', router);

      // catch 404 for routes which are not found and forward to error handler
      this.app.use(function(req, res, next) {
        next(createError(404));
      });

      //Initialize error handler
      new ErrorHandlerUtil(this.app);
      
    }
    catch(err){
      throw err;
    }

  }

  //Method to start the express app
  public Start = (port: number) => {

    return new Promise((resolve, reject) => {
      this.app.listen(
        port,
        () => {
          resolve(port)
        })
        .on('error', (err: object) => reject(err));
    })
  }
}