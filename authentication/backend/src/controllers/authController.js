const express=require('express')
const User=require('../model/userModel')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
require('dotenv').config()

const register=async(req,res)=>{

    const {firstname,lastname,email,password}=req.body
    try{
        const salt= await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(password,salt)

        if(!firstname || !lastname || !email || !password){
            return res.status(400).send("all input is required")
        }

        const oldUser= await User.findOne({email})
        if(oldUser){
            return(res.status(400).send("email already register"))
        }

        if(password.length<8){
            return(res.status(400).send("password should be greater than or equal to 8.."))

        }
     
        const newUser= await User.create({
            firstname,
            lastname,
            password:hashedPassword,
            email
        })
        
        res.status(200).json({
            status:"sucessfully registerd",
            newUser
        })


    }catch(err){
        res.json({
            msg:"somethig wrong",
            err:err
        })
    }


}



const login=async(req,res)=>{

    try{

        !req.body.email || !req.body.password && res.send("both email and password is required")

        const logedUser=await User.findOne({email:req.body.email})
        if(!logedUser){
            return res.status(400).send("email/user not find")
        }

        const validatePassword= await bcrypt.compare(req.body.password, logedUser.password)
        if(!validatePassword){
            return res.status(400).send("email or password is wrong")
        }


        const accessToken=jwt.sign(

            {"email":logedUser.email},
            process.env.ACCESS_TOKEN,
            {expiresIn:'120s'}


        )
        res.status(200).json({
            status:"successfully loged",
            user:logedUser,
            token:accessToken
        })




    }catch(err){
        res.json({
            msg:"somethig wrong",
            err:err
        })

    }

}

module.exports={register,login}