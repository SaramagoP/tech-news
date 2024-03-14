// This module checks if the body of a request contains all the required fields.
function checkBody(body, keys) {
  //
  let isValid = true; // Assume the body is valid

  for (const field of keys) {
    // Loop through the keys array to check if the body contains all the required fields
    if (!body[field] || body[field] === '') {
      // If the body doesn't contain a required field, set isValid to false
      isValid = false;
    }
  }

  // Return the value of isValid
  return isValid;
}

module.exports = { checkBody };
