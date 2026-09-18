import express from "express";

const app = express();

const port = 3000;

import { getUser } from "./controller/userController.js";

app.get("/user",(req , res)=>{
    console.log("user hited")
    let userData = getUser()
    res.send(userData)
})

app.post("/login" , (req , res)=>{
    // data 
    // validate
    // stored data check
    // return response
    console.log(req)
    res.send("hello login")
})

app.post("/register" , (req , res)=>{
    // data 
    // validate
    // store data
    // return response
})

app.post("/profile" , (req , res)=>{
    // data 
    // validate
    // stored data check
    // return response
})

app.listen(port , ()=>{
    console.log("server is live now. on port 3000.")
})