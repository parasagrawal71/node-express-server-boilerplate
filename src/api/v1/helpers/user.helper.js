const { UserModel } = require('api/v1/models');
const { createRecordNotFoundError } = require('utils/response');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
    return UserModel.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Array<QueryResult>}
 */
const queryUsers = async (filter, options) => {
    const users = await UserModel.paginate(filter, options);
    return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
    return UserModel.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
    return UserModel.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Object<User>}
 */
const updateUserById = async (userId, updateBody) => {
    const user = await UserModel.findOneAndUpdate({ _id: userId }, updateBody);
    if (!user) {
        throw createRecordNotFoundError('id', userId);
    }

    return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
    const user = await UserModel.findOneAndDelete({ _id: userId });
    if (!user) {
        throw createRecordNotFoundError('id', userId);
    }

    return user;
};

module.exports = { createUser, queryUsers, getUserById, getUserByEmail, updateUserById, deleteUserById };
