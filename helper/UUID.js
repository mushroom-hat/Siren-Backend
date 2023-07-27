const File = require('../model/File');
const { v4: uuidv4 } = require('uuid');

// Generate unique identifier for uploaded files and store in database
async function generateUUID(filename) {
    if (filename == null) return null;
    const duplicate_files = await File.findOne({ filename: filename }).exec();
    if (duplicate_files) return false;

    // generate UUID and store it in database with filename
    const uniqueId = uuidv4();

    try {
        // create and store new user
        const result = await File.create({
            filename: filename,
            file_identifier: uniqueId,
        });
        console.log('New File UUID mapping created in database.');
        return uniqueId;
    }
    catch (error){
        console.log(error);
    }

    return false;
}


// Get unique identifier for uploaded files from database
async function getFilenameFromUUID(uniqueID) {
    if (uniqueID == null) return null;
    // get UUID from database using filename
    const file = await File.findOne({ file_identifier: uniqueID }).exec();
    if (!file) { return false;}
    return file.filename;
}
module.exports = {
    generateUUID,
    getFilenameFromUUID
};

