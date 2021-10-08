const { gql } = require('apollo-server-express');
const shortid = require('shortid');
const {authCheck} = require('../utils/auth')
const User = require('../models/user')

const me = async (parent, args, context) => {
    await authCheck(context.req);
    return "Takmina";
}

const createUser = async (parent, args, {req}) => {
    const currentUser = await authCheck(req);
    const user = await User.findOne({email: currentUser.email});

    return user ? user : new User({
        email: currentUser.email,
        username: shortid.generate()
    }).save();
}

const updateUser = async (_, args, {req}) => {
    const currentUser = await authCheck(req);
    console.log('args:', args);
    const updatedUser = await User.findOneAndUpdate(
        {email: currentUser.email}, 
        {...args.input}, 
        {new: true}
    ).exec();

    return updatedUser;
}

module.exports = {
    Query: {
        me: me
    },
    Mutation: {
        createUser,
        updateUser
    }
}