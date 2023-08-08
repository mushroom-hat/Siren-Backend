const developmentOrigin = 'http://localhost:3000';
const productionOrigin = 'http://siren-frontend.s3-website-ap-southeast-1.amazonaws.com';

let allowedOrigins;

if (process.env.NODE_ENV === 'production') {
    allowedOrigins = [productionOrigin];
    
} else {
    allowedOrigins = [developmentOrigin, "postman"];
}

module.exports = allowedOrigins;
