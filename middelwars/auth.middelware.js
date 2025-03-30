const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user');
 
const myCache = require('../utilites/SomeFunction')
async function Authenticated(req, res, next) {
  try {

    const token = req.cookies?.thinkio

    if (!token) throw Error("Please login.")

    const data = await jwt.verify(token, process.env.JWT_SECRET);

    let cache_string = `user_${data.id}`
    const cachedBill = myCache.get(cache_string);
    
    if (data) {

      if (cachedBill) {
        req.LoggedUserData = myCache.get(cache_string)
        next()
      } else {

        const UserData = await UserModel.findById(data.id);

        req.LoggedUserData = {
          id: UserData._id,
          username: UserData.username
        };

        myCache.set(cache_string, {
          id: UserData._id,
          username: UserData.username
        }, 90 * 60)

        next()
      }

    }



  } catch (err) {
    res.status(400).json({
      status: false,
      msg: err.message

    })
  }
}


module.exports = Authenticated
