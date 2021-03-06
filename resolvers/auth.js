const { gql } = require("apollo-server-express");
const shortid = require("shortid");
const { authCheck } = require("../utils/auth");
const User = require("../models/user");
const { DateTimeResolver } = require("graphql-scalars");

const profile = async (parent, args, context) => {
	const currentUser = await authCheck(context.req);
	const user = await User.findOne({ email: currentUser.email }).exec();
	return user;
};

const publicProfile = async (parent, args, context) => {
	return await User.findOne({ username: args.username }).exec();
};

const allUsers = async (_, args) => await User.find().exec();

const createUser = async (parent, args, { req }) => {
	const currentUser = await authCheck(req);
	const user = await User.findOne({ email: currentUser.email });

	return user
		? user
		: new User({
				email: currentUser.email,
				username: shortid.generate(),
		  }).save();
};

const updateUser = async (_, args, { req }) => {
	const currentUser = await authCheck(req);
	console.log("args:", args);
	const updatedUser = await User.findOneAndUpdate(
		{ email: currentUser.email },
		{ ...args.input },
		{ new: true }
	).exec();

	return updatedUser;
};

module.exports = {
	Query: {
		profile,
		publicProfile,
		allUsers,
	},
	Mutation: {
		createUser,
		updateUser,
	},
};
