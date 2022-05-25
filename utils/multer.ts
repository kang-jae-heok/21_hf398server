import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
const multers3 = require('multer-s3');
const AWS = require('aws-sdk');
import moment from "moment"


export const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION
  });


  export const upload =  multer({
    storage: multers3({
      s3: s3,
      bucket:"foodingjh",
      contentType: multers3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
    
     
      key:(req:Request, file: any, cb:Function)=>{
        const {email} = req.body
        cb(null, email + '-' + moment(new Date()).format('YYYY-MM-DD HH:mm:ss'+'-'+ file.originalname) );
        
      }, 
    })
  })
  
