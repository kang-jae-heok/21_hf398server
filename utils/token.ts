import { NextFunction, Request, Response } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

const { JWT_KEY } = process.env;

export const signToken = (email :string) => {
  try{
    const token: string | undefined = jwt.sign({
      email
    }, JWT_KEY as string, {
      expiresIn: '1d',
      issuer:'토큰발급자'
    });

    const accessToken = 'Bearer'+' ' +token; 
    return accessToken;
  }catch(err){
    console.log(err);
  }
}

export const decodeToken = (req:Request, res:Response, next: NextFunction) => {
  const token : any  = req.headers.authorization;
  const {email} = req.body;
  
  try {
    const acessToken : string = token;
    const decodedToken : string[] = acessToken.split(" ");
    let decoded_data: any = jwt.verify(decodedToken[1], JWT_KEY as string);
    console.log(decoded_data);
    
    return next();
  } catch (err) {
    console.log(err);
    //토큰 만료되면 재발급 
    if(TokenExpiredError){
        const accessToken = signToken(email);
        console.log(accessToken);
        console.log('토큰재발급완료');
    }
    return err;
  }
}
