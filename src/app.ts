import express, {Express} from 'express';

import router from './routes';

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