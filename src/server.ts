import {App} from './app';

const port : any = process.env.PORT || 3000;

//Initialize Express app
const app = new App();

//Start Express Server
const server = app.Start(port)
  .then(port => console.log(`Server Listening on port ${port}`))
  .catch(error => {
    console.log(error)
    process.exit(1);
  });

export default server;