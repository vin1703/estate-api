import jwt from 'jsonwebtoken'

export const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.token;
    const token = authHeader.split(" ")[1];
    console.log(token);
    if(!token)return res.status(401).json({message:"Not Authenticated!"});
    jwt.verify(token,process.env.JWT_SECRET_KEY,async(err,payload)=>{
      if(err) return res.status(403).json({message:'Token is not Valid'});
      req.userId = payload.id;

      next();
    })
}