import jwt from 'jsonwebtoken';
export const verifyToken = (req, res, next) => {
     const token = req.headers.authorization;
     if (token) {
          jwt.verify(token, process.env.SECRET_TOKEN, (err) => {
               if (err) {
                   return res.send("Failed To Authenticate Token.");
               }
               next(); 
          });
     } else {
         return res.send("No Token Provided.");
     }
}

