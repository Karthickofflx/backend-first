import express from "express";
import pg from "pg";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import db from "./con.js";
import bodyParser from "body-parser";
const verify = jwt ;
const app = express();
const port = 5000;
app.use(cors({
  origin : ['http://localhost:5173'],
  methods : ['GET','POST'],
  credentials : true
}))
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(cookieParser());

const verifyuser = (req,res,next)=>{
  const token = req.cookies.token ;
  if(!token){
    return res.json({Error : "NO loged in"})
  }
  else{
    jwt.verify(token,"jeevagan",(err,decode)=>{
      if(err){
        return res.json({Error : "NO cookies"})
      }
      else{
        req.name = decode.name ;
        next();
      }
    })
  }
}
app.get('/',verifyuser, (req,res)=>{
    return res.json({status:"success",name: req.name})
})

app.post('/login',(req,res)=>{
  const {username , password} = req.body ;
  // console.log(password)
  const client = db.getClient();
  client.connect();
  const query = "SELECT * from Admins WHERE username = $1";
  client.query(query,[username],(err,data)=>{
    if (err) return res.json({message: " something went wrong"});
    if (data.rowCount > 0){
      bcrypt.compare(password,data.rows[0].password ,(err,result)=>{
        if(err) return res.json({err: "something went wrong"});
        if(result){
          const name = data.rows[0].name;
          const token = jwt.sign({name},'jeevagan',{expiresIn:
            '1d'
          });
          res.cookie('token',token);
          return res.json({status : "success",name});
        }
        else{
          return res.json({status : "password not matched"});
        }
      })

    }else{
      return res.json({error: " no user found"});
    }
  })


})


app.listen(port , ()=>{
  console.log("server started");
})
