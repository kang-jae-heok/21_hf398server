import { NextFunction, Request, Response } from "express";
import express from 'express';
import sequelize from '../models/index';
import { decodeToken, signToken } from "../utils/token";


const router = express.Router();
const { alarm } = sequelize.models;

//유저 전체조회
router.get('/all', async (req:Request, res:Response, next:NextFunction)=> {
  try {
    const result = await alarm.findAll();
    console.log(result);
    return res.status(200).send({result});
  }catch(err){
    console.log(err);
  }
});

//유저한명조회
router.get('/one',decodeToken, async (req:Request, res:Response, next:NextFunction)=> {
  const { id } = req.query;

  try {
    const result = await alarm.findOne({
      where:{
        id
      }
    });
    return res.status(200).send({result});
  }catch(err){
    console.log(err);
  }
});

//유저 생성
router.post('/create', async (req:Request, res:Response, next:NextFunction)=> {
  const { id, notice, event, chatting} = req.body;

  try {
    const result = await alarm.create({
      notice,
      event,
      chatting
    });

    return res.status(200).send({result});
  }catch(err){
    console.log(err);
  }
});

//유저 수정
router.put('/update',decodeToken, async (req:Request, res:Response, next:NextFunction)=> {
  const {id, notice, event, chatting} = req.body;
  try {
    const result = await alarm.update({
      notice,
      event,
      chatting
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


//유저삭제
router.delete('/delete',decodeToken, async (req:Request, res:Response, next:NextFunction)=> {
  const { id } = req.query;
  try {
    const result = await alarm.destroy({
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