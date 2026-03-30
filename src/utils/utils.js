//falta entender esto:

import multer from "multer";

// Multer
const storage = multer.diskStorage({
    destination: function( req, file, cb){
        cb(null,  '../public/images');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

export const upload = multer({storage})