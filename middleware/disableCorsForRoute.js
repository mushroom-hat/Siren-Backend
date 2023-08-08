const disableCorsForRoute = (req, res, next) => {
    // Set the CORS headers as per your requirement
    res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Origin', true);

    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
    // Call next() to move to the next middleware
    next();
  };
  

module.exports = disableCorsForRoute;
