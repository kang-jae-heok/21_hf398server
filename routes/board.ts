import { NextFunction, Request, Response } from "express";
import express from 'express';
import sequelize from '../models/index';
import { decodeToken } from "../utils/token";
import { s3, upload } from "../utils/multer";

const router = express.Router();
const { user, board, media } = sequelize.models;
const Sequelize = require('sequelize');
const op = Sequelize.Op;

//유저 전체조회
router.get('/all', async (req:Request, res:Response, next:NextFunction)=> {
  try {
    const result = await board.findAll();
    console.log(result);
    return res.status(200).send({result});
  }catch(err){
    console.log(err);
  }
});

//유저한명조회
router.get('/one', async (req:Request, res:Response, next:NextFunction)=> {
  const { id } = req.query;

  try {
    const result = await board.findOne({
      where:{
        id
      }
    });
    return res.status(200).send({result});
  }catch(err){
    console.log(err);
  }
});

//게시판 생성
router.post('/create', async (req:Request, res:Response, next:NextFunction)=> {

  const { title, content, price, category, state, id ,email} = req.body;

  const users:any = await user.findOne({
    where:{
      email
    }
  })
  try {  
    const result: any = await board.create({
      title,
      content,
      price,
      category,
      state,
      userId: users.id
    });

   


    const medias:any = await media.findOrCreate({
      where:{
        boardId: result.id,
        imgPath:"gggg"
      }});

      console.log(medias);
    return res.status(200).send({result});
  }catch(err){
    console.log(err);
  }
});

//유저 수정
router.put('/update', async (req:Request, res:Response, next:NextFunction)=> {
  const { title, content, price, category, state, id } = req.body;
  try {
    const result = await board.update({
      title,
      content,
      price,
      category,
      state
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
router.delete('/delete', async (req:Request, res:Response, next:NextFunction)=> {
  const { id } = req.query;
  try {
    const result = await board.destroy({
      where:{
        id
      }
    })
  } catch (err) {
    console.log(err);  
  }
});


//이미지 s3에저장
router.post('/image',  upload.array('image'), async (req:any , res:Response, next:NextFunction)=>{

const {boardId} = req.body;

  var arr = []
  for(var i =0; i<req.files.length;i++){
    arr.push(req.files[i].location);
  }
  if(arr.length==1){
    await media.update({
      imgPath:arr
     },{
       where:{
         boardId
       }
     })
  }else{
    await media.update({
      imgPath:arr[0]
     },{
       where:{
         boardId
       }
     })
    for(var i=1;i<arr.length;i++){
      await media.create({
        boardId,
        imgPath:arr[1]
      })
    }
  }
  // console.log(arr);
 
  try {
    
    console.log("실행완료");



    return res.status(200).json({
      code:200,
      message:'실행 완료',
      arr: arr,
      
    })
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code:500,
      message:'서버 에러' 
    })
  }
});


//imgPath  가져오기
router.get('/get',async (req:any , res:Response, next:NextFunction)=>{
  const {board_id}  = req.body;
  
  try {
    const result = await media.findAll({
      where:{
        board_id
      }
    });

    
    
    
    return res.status(200).json({
      code:200,
      message:'실행 완료',
      result:result
    
      
    })
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code:500,
      message:'서버 에러' 
    })
  }
});




export default router;