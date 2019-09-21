import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/ping', function(req, res, next) {
  res.send('pong');
});

export default router;
