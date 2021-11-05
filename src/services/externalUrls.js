const { JSON_PLACEHOLDER_HOST } = require('config/config');

// ******************************************************************************************************** //
// ************************************* 'JSON PLACEHOLDER' endpoints ************************************* //
// ******************************************************************************************************** //
module.exports.jsonPlaceholderUrls = (postId) => ({
    getAll: {
        host: JSON_PLACEHOLDER_HOST,
        method: 'GET',
        endpoint: `/posts`,
    },
    getById: {
        host: JSON_PLACEHOLDER_HOST,
        method: 'GET',
        endpoint: `/posts/${postId}`,
    },
    post: {
        host: JSON_PLACEHOLDER_HOST,
        method: 'POST',
        endpoint: `/posts`,
    },
});
