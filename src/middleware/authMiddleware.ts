import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken' ;
import User from '../model/user';
//authentication function
export const authenticateToken = async(req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken ;


    const authToken =  req.header('authorization');

    if(!authToken || !refreshToken){
        return res.status(405).json({message : " Authentication Failed : No authToken or refreshToken is provided "})
    }

    jwt.verify(authToken.replace('Bearer ', ''),process.env.JWT_SECRET_KEY||"",(err:any,decode:any)=>{
        
        if(err) {
            jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET_KEY||"",(refreshErr:any,refreshDecode:any)=> {
            
                if(refreshErr){
                    return res.status(401).json({message : " Authentication Failed : Both tokens are invalid"}) ;
                }
                else{
                 
                    const newAuthToken = jwt.sign({userId : refreshDecode.userId},process.env.JWT_SECRET_KEY||"",{expiresIn : '30m'});
                    const newRefreshToken = jwt.sign({userId : refreshDecode.userId},process.env.JWT_REFRESH_SECRET_KEY||"",{expiresIn : '2h'})
         
                    res.cookie('authToken',newAuthToken,{httpOnly:true}) ;
                    res.cookie('refreshToken',newRefreshToken,{httpOnly : true }) ;
                    res.header('Authorization', `Bearer ${newAuthToken}`);
          
                    const find_user = User.findById(refreshDecode.userId);
                    if(!find_user){
                        return res.status(400).send("You are not authenticated User");
                    }else{
                        req.userId=refreshDecode.userId;
                
                        next();
                    }
                }
            })
        }
        else{
            const find_user = User.findById(decode.userId );
            if(!find_user){
                return res.status(400).send("You are not authenticated User");
            }else{
                req.userId=decode.userId;
                // console.log(decode.userId);
                next();
            }
   }
})

};