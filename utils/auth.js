const admin = require("firebase-admin");

const serviceAccount = require("../config/fbServiceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


exports.authCheck = async (req) => {
   try {
       const currentUser = await admin.auth().verifyIdToken(req.headers.authtoken);
       console.log('CURRENT USER: ', currentUser);
       return currentUser;
   } catch (error) {
       console.log('AUTH CHECK ERROR', error);
       throw new Error('Invalid or expired token!');
   }
}
exports.authCheckMiddleware = async (req, res, next) => {
   try {
     await admin.auth().verifyIdToken(req.headers.authtoken);
     next();
   } catch (error) {
       console.log('AUTH CHECK ERROR', error);
       res.jsson({error: error.message});
   }
}



// this the main logic
// exports.authCheck = (req, res, next = f => f) => {
//     if(!req.headers.authtoken) throw new Error('Unauthorized');

//     // check token is valid or not?
//     const valid = req.headers.authtoken === "secret";
//     if(!valid){
//         throw new Error("Invalid token");
//     } else {
//         next();
//     }
// }