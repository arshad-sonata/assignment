/**
 * Candidate endpoints.
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const db = require('../../../db');
const service = require('../../../services/candidate.service')(db);
const importCandidate = require('./import-candidate')(service);


module.exports = () => {


  router.post('/import', 
  	uploadFileMiddleware,   
    importCandidate
  );

  
  return router;
};

// Upload File
function uploadFileMiddleware(req, res, next) { 
    global.__basedir = __dirname;
    var uploadStorage = multer.diskStorage({
    	//destination folder to store uploaded file
        destination: function (req, file, cb) {
            cb(null, __basedir+'/../../../../public/uploads');
        },
        filename: function (req, file, cb) {          
            cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
        }
    });

    var uploader = multer({storage: uploadStorage, fileFilter: function (req, file, callback) {
    	  // check file type
          if(file.mimetype.toLowerCase() !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && file.mimetype.toLowerCase() !== 'application/vnd.ms-excel' ) {
              return callback(new Error('Allow only .xls and .xlsx file'))
          }
          else
          	callback(null, true)
      }
    });
    // Upload file input field
    var uploadFile = uploader.single("uploadfile");
   
    uploadFile(req, res, function (err) { 
    	if(err){
    		res.send({status: false, message:err.message});
    		return;
    	}
    	if(!req.file){
    		res.send({status: false, message:"Please upload file"});
    		return;
    	}
    	req.body.filename = req.file.filename;
    	req.body.filepath = __basedir + '/../../../../public/uploads/'+req.file.filename;
    	next();
    })
}