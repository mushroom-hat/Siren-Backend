const developmentOrigin = 'http://localhost:3000';
const productionOrigin = 'http://siren.mushroomhat.co';
const s3Origin = 'http://siren.mushroomhat.co.s3-website-ap-southeast-1.amazonaws.com';

let allowedOrigins;

if (process.env.NODE_ENV === 'production') {
    allowedOrigins = [productionOrigin, s3Origin];
    
} else {
    allowedOrigins = [developmentOrigin, "postman"];
}

module.exports = allowedOrigins;
