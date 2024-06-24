import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken'
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // HASH THE PASSWORD

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);

    // CREATE A NEW USER AND SAVE TO DB
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });


    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user!" });
  }
};

export const login =async (req, res) => {
  const {username,password} = req.body;

  try{
    const user = await prisma.user.findUnique({where:{username}});
    if(!user)return res.status(401).json({message:'Invalid Credentials!'});
    const isPasswordValid = await bcrypt.compare(password,user.password);

    if(!isPasswordValid)return res.status(401).json({message:"Invalid Credentials!"});
    const age = 1000*60*60*24*7;
    const token = jwt.sign({
      id:user.id,
      isAdmin : true,
    },process.env.JWT_SECRET_KEY,{expiresIn:age});
    console.log(user.id);

    const {password:userPassword,...userInfo} = user


    // res.setHeader("Set-Cookie","test="+"myValue");
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Uncomment in production or HTTPS environments
      path: '/',
      domain: "estate-2qkt.onrender.com", // Set to your domain name without protocol
      maxAge: age,
    }).status(200).json(userInfo);

    
    
  }catch(err){
    console.log(err);
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({message:"logout successfull"})
};
