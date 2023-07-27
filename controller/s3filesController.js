const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3"); 
const client = new S3Client({ region: "ap-southeast-1"});
const fs = require('fs');
const { createWriteStream } = require('fs');
const path = require('path');
const mime = require('mime-types');
const { getFilenameFromUUID, generateUUID } = require('../helper/UUID');

const BUCKET_NAME = "easybaton";
const UPLOADS_DIR = "./uploads/"
const DOWNLOADS_DIR = "./downloads/"

const getFile = async (req, res) => {
    if (!req?.params?.uniqueID) return res.status(400).json({ 'message': 'Filename/File UUID required.' });
    const fileUniqueID = req.params.uniqueID;

    // Get filename from UUID from database 
    const filename = await getFilenameFromUUID(fileUniqueID);
    if (!filename) return res.status(400).json({ 'message': 'Invalid File UUID.' });

    const filepath = path.join(DOWNLOADS_DIR, filename);  // Replace with the path to your file

    // file parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
    };
    const command = new GetObjectCommand(params);

    // Download file from AWS S3
    try {
        const data = await client.send(command);
        data.Body.pipe(createWriteStream(filepath)); // This will not cause the server to restart.
        console.log(`Successfully downloaded data to ${BUCKET_NAME}/${filename}`);
        res.status(200).json({ message: 'File retrieved successfully' });
      } catch (error) {
        // error handling.
        console.log(error);
    }
}

const uploadFile = async (req, res) => {
    // Read the file
    const filepath = path.join(UPLOADS_DIR, "usersController.js");  // Replace with the path to your file
    // Get the file extension and file name
    const filename = filepath.split('\\').pop();
    const fileExtension = filepath.split('.').pop();
    const fileContent = fs.readFileSync(filepath);

    // Determine the content type based on the file extension
    const contentType = mime.lookup(fileExtension) || 'application/octet-stream';
    
    // Generate file unique identifier and store in database
    const fileUniqueID = await generateUUID(filename);
    console.log(fileUniqueID);
    if (!fileUniqueID) return res.status(500).json({ message: 'Error generating UUID for file. Upload fail.' });

    // file parameters
    const params = {
        Body: fileContent,
        Bucket: BUCKET_NAME,
        Key: filename,
        ContentType: contentType,
    };
    const command = new PutObjectCommand(params);

    // Upload file to AWS S3
    await client.send(command).then(
        (data) => {
            console.log(`Successfully uploaded data to ${BUCKET_NAME}/${filename}`);
            res.status(200).json({ 'message': `File uploaded successfully. File UUID: ${fileUniqueID}`});
        })
        .catch((error) => {
          // error handling.
        });
   
}


module.exports = {
    getFile,
    uploadFile
}