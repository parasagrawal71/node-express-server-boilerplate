const axios = require('axios');

// CUSTOM IMPORTS
const { appLogger } = require('utils/appLogger');

// HTTP Constants
const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const DELETE = 'DELETE';
const PATCH = 'PATCH';

/**
 *  Function to log the reponse from external service
 *
 */
const logResponse = (type, responseOrError, apiResource) => {
    const { endpoint } = apiResource;
    let { method } = apiResource;
    method = method && method.toUpperCase();

    if (type === 'success') {
        const responseData = responseOrError && responseOrError.data;
        const statusCode = responseOrError && responseOrError.status;
        appLogger.info({
            msg: `Response from external service, ${method} ${endpoint}: statusCode = ${statusCode}`,
            info: responseData,
        });
    }

    if (type === 'error') {
        const statusCode = responseOrError && responseOrError.response && responseOrError.response.status;
        const errorCode = responseOrError && responseOrError.code;
        appLogger.error({
            msg: `Error from external service, ${method} ${endpoint}: ${statusCode ? `statusCode = ${statusCode}` : `errorCode = ${errorCode}`}`,
            error: responseOrError,
        });
    }
};

/**
 *  Function to request external service
 *
 */
/*
    Syntax and Example:
    ------------------

    Syntax:
        requestExternalService(xyzUrls().someUrl, JSON.stringify({ keyName: value }), {
            params: { paramName: "paramValue" },
            headers: { headerName: "headerValue" },
        })

    Example:
        requestExternalService(xyzUrls().resource)
        requestExternalService(abcUrls("variable_value").resource)
*/
module.exports.requestExternalService = (apiResource, requestBody = {}, { params, headers, ...restConfig } = {}) => {
    const { host, endpoint } = apiResource;
    let { method } = apiResource;
    method = method && method.toUpperCase();

    const configToRequest = {
        params: { ...(params || {}) },
        headers: { ...(headers || {}) },
        ...(restConfig || {}),
    };

    appLogger.info({ msg: `Requesting external service, ${method} ${endpoint}`, info: { requestBody, configToRequest } });

    switch (method) {
        case GET:
            return axios
                .get(`${host}${endpoint}`, configToRequest)
                .then((response) => {
                    const responseData = response && response.data;
                    logResponse('success', response, apiResource);
                    return responseData;
                })
                .catch((error) => {
                    logResponse('error', error, apiResource);
                    throw error;
                });

        case POST:
            return axios
                .post(`${host}${endpoint}`, requestBody, configToRequest)
                .then((response) => {
                    const responseData = response && response.data;
                    logResponse('success', response, apiResource);
                    return responseData;
                })
                .catch((error) => {
                    logResponse('error', error, apiResource);
                    throw error;
                });

        case PUT:
            return axios
                .put(`${host}${endpoint}`, requestBody, configToRequest)
                .then((response) => {
                    const responseData = response && response.data;
                    logResponse('success', response, apiResource);
                    return responseData;
                })
                .catch((error) => {
                    logResponse('error', error, apiResource);
                    throw error;
                });

        case DELETE:
            return axios
                .delete(`${host}${endpoint}`, configToRequest)
                .then((response) => {
                    const responseData = response && response.data;
                    logResponse('success', response, apiResource);
                    return responseData;
                })
                .catch((error) => {
                    logResponse('error', error, apiResource);
                    throw error;
                });

        case PATCH:
            return axios
                .patch(`${host}${endpoint}`, configToRequest)
                .then((response) => {
                    const responseData = response && response.data;
                    logResponse('success', response, apiResource);
                    return responseData;
                })
                .catch((error) => {
                    logResponse('error', error, apiResource);
                    throw error;
                });

        default:
            return 'Method not matched';
    }
};
