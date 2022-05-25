import { NextFunction, Request, Response } from "express";
import { decodeToken, signToken } from "../utils/token";
import sequelize from '../models/index';
const {  media,user,board } = sequelize.models;

var express = require('express');



var router = express.Router();
var models = require('../models');



//이메일로 boardId 가져오기
// router.get('/boardId', async (req:Request, res:Response, next:NextFunction)=> {
//   const {email} = req.body;
//   try {
//     const result:any = await user.findOne({
//       where:{
//         email
//       }
//     });
//     console.log(result.id);
    
//     const result2:any = await board.findOne({
//       where:{
//         userId:result.id
//       }
//     })
//     console.log(result2.id);
    
    
//     const boardId = result2.id
//     console.log(boardId);
    
//     return res.status(200).send({boardId});
//   }catch(err){
//     console.log(err);
//   }
// });


//전체조회
router.get('/all', async (req:Request, res:Response, next:NextFunction)=> {
  try {
    const result = await media.findAll();
    console.log(result);
    return res.status(200).send({result});
  }catch(err){
    console.log(err);
  }
});

// 한명조회
router.get('/one', async (req:Request, res:Response, next:NextFunction)=> {
  const { id } = req.query;

  try {
    const result = await media.findOne({
      where:{
        id
      }
    });
    return res.status(200).send({result});
  }catch(err){
    console.log(err);
  }
});

//생성
router.post('/create', async (req:Request, res:Response, next:NextFunction)=> {
  const {imgName, imgPath, imgType} = req.body;

  try {
    const result = await media.create({
        imgName,
        imgPath,
        imgType
    });

    return res.status(200).send({result});
  }catch(err){
    console.log(err);
  }
});

//수정
router.put('/update', async (req:Request, res:Response, next:NextFunction)=> {
  const {imgName, imgPath, imgType, id } = req.body;

  try {
    const result = await media.update({
        imgName,
        imgPath,
        imgType
    },{
      where:{
        id,
      }
    });

    return res.status(200).send({result});
  }catch(err){
    console.log(err);
  }
});


//삭제
router.delete('/delete',decodeToken, async (req:Request, res:Response, next:NextFunction)=> {
  const { id } = req.query;
  try {
    const result = await media.destroy({
      where:{
        id,
      }
    });
    return res.status(200).send({result});
  }catch(err){
    console.log(err);
  }
});


export default router;
