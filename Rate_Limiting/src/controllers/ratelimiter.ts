import { Request,Response } from "express"
export class redisController{

  static ratelimeter=async(req:Request,res:Response)=>{
    try{
      const { user_id } = req.body;
      res.status(200).send({message:"Task Done",Id:user_id});
    }catch(error){
      res.status(500).send({status:false,message:error.message})
    }
  }


}