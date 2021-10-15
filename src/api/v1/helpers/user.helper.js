const { UserModel } = require('api/v1/models');
const { createDuplicateValueError, createRecordNotFoundError } = require('utils/response');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
    if (await UserModel.isEmailTaken(userBody.email)) {
        throw createDuplicateValueError('email', userBody.email);
    }

    return UserModel.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>} // todo:
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
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
    const user = await getUserById(userId);
    if (!user) {
        throw createRecordNotFoundError('id', userId);
    }
    if (updateBody.email && (await UserModel.isEmailTaken(updateBody.email, userId))) {
        throw createDuplicateValueError('email', updateBody.email);
    }

    Object.assign(user, updateBody);
    await user.save(); // todo findOneAndUpdate?
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
