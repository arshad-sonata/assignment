/**
 * Candidate services
 */

module.exports = function (db) {
  const fs = require('fs');
  const readXlsxFile = require('read-excel-file/node');
  const validation = require('../utils/validation');
  const async = require('async');
  const CONDIDATE_TABLE = "candidate_summary";

  return {    
    
    /* Import Candidate Data */
    importData: (formdata, fn) => {
      // Read Excel File
      readXlsxFile(formdata.filepath).then((rows) => {        
        let invalidData = [];
        let duplicateData = [];   
        let successRecords = [];     
        let failedItem = [];
        // Remove First Row which contain heading
        rows.shift();
        async.forEach(rows, (row, cb) => {
          //Checking Excel Column Length
          if(row.length < 11)
            return fn(null,{status: false, message:"Invalid sheet format some column missing"});
          // Validate Input data type 
          let inputErrors = validation.validateInputData(row);
          if (Object.keys(inputErrors).length > 0){
            invalidData.push({message: "Invalid data format", errors: inputErrors, data: row});
            cb();
          }
          else{
            // Check data already exists or not
            let checkDuplicateData = 'SELECT * FROM '+CONDIDATE_TABLE+' WHERE name = $1 OR email_id = $2 OR phone_number = $3';
            
            db.query(checkDuplicateData, [row[0], row[7], row[8]], (error, response) => {
              if(error)
                cb();
              else{
                
                // Duplicate Data
                if(response.rowCount > 0 ){
                  duplicateData.push(row);
                  cb();
                }
                else{
                  // Insert New Data
                  let candidateData = {
                    ctc:  {
                      value : row[5],
                      ctcUnit: row[6],
                      ctcCurrency : row[4],
                    },
                    candidateExperience: row[3],
                    company : {
                      name: row[2]
                    },
                    location : {
                      city: row[9]
                    },
                    linkedIn: row[10] 
                  }
                  // Insert Query
                  let insertInputData = 'INSERT INTO '+CONDIDATE_TABLE+' (name, email_id, phone_number, candidates_data, created_by, modified_by) VALUES ($1,$2,$3,$4,$5, $6)';
                  db.query(insertInputData, [row[0], row[7].toLowerCase(), row[8], JSON.stringify(candidateData), "Arshad", "Arshad"], (err, insteredData) => {
                    // Failed item to insert                    
                    if(err)
                      failedItem.push(row);
                    else
                      successRecords.push(row)
                    cb();
                  });
                }
                
                
              }
            });
          }
        }, (err, data) => {
          if(err){
            return fn(null, {status: false, error: err});
          }

          // return final response
          return fn(null, {
            totalSuccessRecords: successRecords.length,
            totalDuplicateRecords: duplicateData.length,
            totalInvalidRecords: invalidData.length,
            totalFailedItem: failedItem.length,
            invalidData: invalidData,
            duplicateData: duplicateData, 
            successRecords: successRecords, 
            failedItem: failedItem
          });
        })
          
        
      }).catch((error) => {
          return fn(error)
      })
    },
  
  };
};

