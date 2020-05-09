const {dynamoDb} = require('../dbConfig/dynamoDb');
const {cognito} = require('../cognitoConfig/cognito');
const {validateSchema} = require('../utils/validator');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const {schema} = require('../utils/schema');
const moment = require('moment');
const signUp = async (req, res) => {
  try {
    await validateSchema(req.body, schema.signUpSchema);
    const {email, password, firstName, lastName} = req.body;
    if (await checkIfUserExists(email)) {
      const response = errorCodes['userAlreadyExists'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code
      });
    }
    const cognitoSignUp = await cognito.signUp(email, password);
    await dynamoDb.create({sub: cognitoSignUp.UserSub, email, created: moment.utc(), firstName, lastName});
    const response = successCodes['signUpSuccess'];
    return res.status(response.statusCode).send({
      statusCode: response.statusCode,
      code: response.code
    });
  } catch (e) {
    //Needed to be defined again
    if (e.code === 'schemaError') {
      const response = errorCodes['joi'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code
      });
    } else {
      //default error
      const response = errorCodes['default'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code
      });
    }
  }
};

const checkIfUserExists = async email => {
  const doesUserExists = await dynamoDb.get(email);
  if (doesUserExists.Item) {
    return true;
  } else return false;
};
module.exports = {signUp};