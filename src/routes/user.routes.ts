import express from 'express';
const userRouter = express.Router();

/* Ping Api*/
userRouter.get('/ping', function(req, res, next) {
  res.send('pong');
});


export default userRouter;
