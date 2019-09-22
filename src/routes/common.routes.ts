import express from 'express';
const commonRouter = express.Router();

/* Ping Api*/
commonRouter.get('/ping', function(req, res, next) {
  res.send('pong');
});


export default commonRouter;
