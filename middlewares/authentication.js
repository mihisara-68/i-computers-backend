 import jwt from 'jsonwebtoken';
 
 export default function authenticateUser (req,res,next){

        const header = req.header("Authorization")
        
        if(header !=null){

            const token = header.replace("Bearer ", "")
        
            jwt.verify(token,"mihisara",
                (error,decoded)=>{
                    console.log(decoded)

                    if(decoded == null){
                        res.json(
                            {
                                message : "Invalid Token Please Loging Again"
                            }
                        )
                    }else{
                        req.user = decoded
                        next()
                    }
                }
            )

        }else{
            next()
        }
    }
 