const successResponse = (res,  message = 'Request was successful', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      statusCode: 200,
      message,
    });
  };
  
  const errorResponse = (res, message = 'An error occurred', statusCode = 500, error = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      error,
    });
  };
  
  module.exports = { successResponse, errorResponse };