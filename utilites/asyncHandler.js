
export const asyncHandler = (myfunc, path) => {
  return async (req, res, next) => {
    try {
      await myfunc(req, res);

    } catch (err) {
      console.log(err)
      res.status(400).json({
        status: false,
        message: err.message,
        route: path
      });


    }
  };
};

