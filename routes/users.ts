import { NextFunction, request, Request, response, Response } from "express";
import express from 'express';
import sequelize from '../models/index';
import { decodeToken, signToken } from "../utils/token";
import { s3, upload } from "../utils/multer";
import {Tesseract} from "tesseract.ts"
import moment from "moment"
import { isNativeError } from "util/types";
import multer from 'multer';
import { createWorker } from "tesseract.js";
const multers3 = require('multer-s3');
const path = require('path');
const router = express.Router();
const { user } = sequelize.models;
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config;


// const img = document.getElementById("eeveelutions");
// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");

// img.onload = function () {
//   img.crossOrigin = "anonymous";
//   ctx.drawImage(img, 0, 0);
//   const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//   for (var i = 0; i < imgData.data.length; i += 4) {
//     let count = imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2];
//     let colour = 0;
//     if (count > 510) colour = 255;
//     else if (count > 255) colour = 127.5;

//     imgData.data[i] = colour;
//     imgData.data[i + 1] = colour;
//     imgData.data[i + 2] = colour;
//     imgData.data[i + 3] = 255;
//   }
//   ctx.putImageData(imgData, 0, 0);
// };




// async function ocrwithtesseractjs() {
//   await Tesseract.load()
//   await Tesseract.loadLanguage('eng')
//   await Tesseract.initialize('eng')
//   await Tesseract.setParameters({
//     tessedit_char_whitelist: '0123456789',
//   })

//   const { data: { recognizedText } } = await Tesseract.recognize('https://foodingjh.s3.ap-northeast-2.amazonaws.com/kjhabc8707%40google.com-2021-09-23%2019%3A08%3A51-1.jpg');

//   await Tesseract.terminate()

//   return recognizedText
// }

// 이미지에서 글자 추출 
router.get('/find', async (req:Request, res:Response, next:NextFunction)=> {
  try {
  const worker= createWorker();
  (async ()=> {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({
    tessedit_char_whitelist: '0123456789',
  });
  const { data: { text } }= await worker.recognize('https://foodingjh.s3.ap-northeast-2.amazonaws.com/undefined-2021-09-30%2023%3A43%3A17-12345.jpg');
  console.log(text);
  await worker.terminate();
})();
    return res.status(200).json({
      code:200,
      message:'실행 완료' 
    })
  }catch(err){
    console.log(err);
  }
});


// // 이미지에서 글자 추출 
// router.get('/find', async (req:Request, res:Response, next:NextFunction)=> {
//   try {
//     ocrwithtesseractjs().then(console.log)
//     .catch(console.error);

//     return res.status(200).json({
//       code:200,
//       message:'실행 완료' 
//     })
//   }catch(err){
//     console.log(err);
//   }
// });

//boardId 찾기



//유저 전체조회
router.get('/all', async (req:Request, res:Response, next:NextFunction)=> {
  try {
    const result = await user.findAll();
    console.log(result);
    return res.status(200).send({result});
  }catch(err){
    console.log(err);
  }
});

//유저한명조회
router.get('/one', decodeToken, async (req:Request, res:Response, next:NextFunction)=> {
  const { email } = req.query;

  try {
    const result = await user.findOne({
      where:{
        email
      }
    });
    return res.status(200).send({result});
  }catch(err){
    console.log("err");
  }
});
//토큰 발급
router.post('/login', async (req:Request, res:Response, next:NextFunction)=>{
    const {email, name, address, profileImg, kindness, declaration} = req.body;

     
    try {
      const result = await user.findOne({
        where:{
          email
        }
      });
      if(result){
        try {
          const accessToken = signToken(email);
         console.log(accessToken);
         
          return res.json({
            code:200,
            message:'토큰이 발급되었습니다',
            accessToken
          });
        } catch (err) {
          console.log(err);
          return res.status(500).json({
            code:500,
            message:'서버 에러' 
          })
        }

      }else{
        try {
          const accessToken = signToken(email);
          const result = await user.create({
           email
          })
         return res.status(200).send({result, token:accessToken});
        } catch (err) {
          console.log(err);
          
        }

      }
    } catch (err) {
      console.log("err");
    }
});

//유저정보에 닉네임 추가
router.put('/add', async (req:Request, res:Response, next:NextFunction)=> {
  const {name, email} = req.query;
  const {id,address,  profileImg, kindness, declaration} = req.body
  try {
    const result = await user.update({
      id,
      email,
      name,
      address, 
      profileImg,
      kindness,
      declaration
    },{
      where:{
        email
      }
    });

    return res.status(200).send({result});
  }catch(err){
    console.log(err);
  }
});

//유저 생성
router.post('/create', async (req:Request, res:Response, next:NextFunction)=> {
  const { email, name, address, profileImg, kindness, declaration, token} = req.body;

  try {
    const result = await user.create({
      email,
      name,
      address, 
      profileImg,
      kindness,
      declaration,
      token
    });

    return res.status(200).send({result});
  }catch(err){
    console.log(err);
  }
});

//유저 수정
router.put('/update', async (req:Request, res:Response, next:NextFunction)=> {
  const {id, email, name, address, profileImg, kindness, declaration } = req.body;

  try {
    const result = await user.update({
      email,
      name,
      address, 
      profileImg,
      kindness,
      declaration
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
    const result = await user.destroy({
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