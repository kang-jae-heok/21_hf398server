import express, { NextFunction, Request, Response } from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', function(req:Request, res:Response, next:NextFunction) {
  res.send({result:true, data:"할루"});
});

export default router;
