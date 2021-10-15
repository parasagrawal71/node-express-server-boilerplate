const httpCodeMessageMapping = {
    // SUCCESS
    200: 'OK',
    201: 'Created',

    // REDIRECTs
    304: 'Not Modified',

    // CLIENT ERRORs
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',

    // SERVER ERRORs,
    500: 'Internal Server Error',
    504: 'Request Timed out',
};

module.exports.getHttpMessage = (statusCode) => {
    return httpCodeMessageMapping[Number(statusCode)];
};
