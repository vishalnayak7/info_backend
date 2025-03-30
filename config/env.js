import dotenv from 'dotenv';

dotenv.config();


// let productionDBpass = '0V2Dn3LdbqjfvAwV';
// let productionDBuser = 'drsuthar781';

 
export let ENV = {}

if (process.env.NODE_ENV == 'development') {
  ENV = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET,
    apiAccess: process.env.API_ACCESS || 'false',
    mongodbUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/info',
    redis_que: process.env.REDIS_QUE,
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };

} else {

  ENV = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET,
    apiAccess: process.env.API_ACCESS || 'false',
    mongodbUrl: process.env.PROD_MONGODB_URI || 'mongodb://localhost:27017/info',
    redis_que: process.env.REDIS_QUE,
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };


}

// 67e3bb37ebdd1b0b1e6a7549

