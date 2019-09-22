import express from 'express';
const adminRouter = express.Router();

/* Ping Api*/
adminRouter.get('/ping', function(req, res, next) {
  res.send('pong');
});


export default adminRouter;
