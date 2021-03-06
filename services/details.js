const {dynamoDb} = require('../dbConfig/dynamoDb');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const details = async (req, res) => {
  try {
    const email = /*req.apiGateway.event.requestContext.authorizer.claims*/ 'dikshit.kathuria@blazeclan.com';
    const params = {
      TableName: process.env.ADMIN_TABLE,
      Key: {
        email
      }
    };
    const details = await dynamoDb.get(params);
    delete details.Item.sub;
    const response = successCodes['detailsSuccess'];
    return res.status(response.statusCode).send({
      statusCode: response.statusCode,
      code: response.code,
      details: details.Item
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

module.exports = {details};
