/**
 * Common validation logic.
 */

module.exports = {

  // Validate Excel Data Format
  validateInputData: (userInput) => {
    var errors = {};   

    if (!userInput[7] || userInput[7].trim() === '') 
      errors['email'] = 'email column should not be blank';

    if (!userInput[0] || userInput[0].trim() == '') 
      errors['name'] = 'name column should not be blank';

    if (!userInput[8] || userInput[8] == '') 
      errors['contactNumber'] = 'contact number should not be blank';
    

    if (userInput[7]) {
      if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userInput[7]))) 
        errors['email'] = 'email address is invalid';
      
    }

    if (userInput[4]) {
      if(userInput[4].toLowerCase() == "inr"){
        if(userInput[6].toLowerCase() != "lakhs" && userInput[6].toLowerCase() != "crores")
          errors['ctcType'] = 'ctc type is invalid';
      }
    }

    if (userInput[5] && isNaN(userInput[5])) 
      errors['ctc'] = 'ctc is invalid';
    

    if(userInput[3] && isNaN(userInput[3]))
      errors['experience'] = 'experience is invalid';
    
    

    
    return errors;
  },

  

 

};
