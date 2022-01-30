const Ajv = require('ajv');
const addFormats = require('ajv-formats').default;
const ajvKeywords = require('ajv-keywords');
const ajvErrors = require('ajv-errors');

const ajv = new Ajv({ $data: true, coerceTypes: true, allErrors: true });
addFormats(ajv);
ajvKeywords(ajv, ['transform']);
ajv.addKeyword('isNotEmpty', {
    type: 'string',
    validate: function (schema, data) {
        return typeof data === 'string' && data.trim() !== '';
    },
    errors: false,
});
ajvErrors(ajv);

module.exports.validateParams = (paramsSchema, inputParams) => {
    // IMPORTANT: Error thrown from here should be handled where it's getting called
    const validated = ajv.validate(paramsSchema, inputParams);
    if (!validated) {
        ajv.errors[0].errorType = 'PARAMS_ERR';
        Error.stackTraceLimit = 10;
        Error.captureStackTrace(ajv.errors[0]);
        throw ajv.errors[0];
    }
};

module.exports.validate = (schema, input) => {
    // IMPORTANT: Error thrown from here should be handled where it's getting called
    const validated = ajv.validate(schema, input);
    if (!validated) {
        Error.stackTraceLimit = 10;
        Error.captureStackTrace(ajv.errors[0]);
        throw ajv.errors[0]; // todo: use AppError??
    }
};
