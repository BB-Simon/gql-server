const { gql } = require("apollo-server-express");
const { posts } = require("../temp/posts");
const { authCheck } = require("../utils/auth");
const { DateTimeResolver } = require("graphql-scalars");
const User = require("../models/user");
const Post = require("../models/post");

// Query

// Mutation
const createPost = async (_, args, { req }) => {
	const currentUser = await authCheck(req);

	// validation
	if (args.input.content.trim() === "") throw new Error("Content is required");

	try {
		const user = await User.findOne({ email: currentUser.email });
		const newPost = await new Post({
			...args.input,
			postedBy: user._id,
		})
			.save()
			.then((post) => post.populate("postedBy", "_id username"));

		return newPost;
	} catch (error) {
		console.log(error);
	}
};

const allPosts = async (_, args) => {
	return await Post.find({}).populate("postedBy", "_id username").exec();
};

const postsByUser = async (_, args, { req }) => {
	const currentUser = await authCheck(req);
	const user = await User.findOne({ email: currentUser.email }).exec();
	return await Post.find({ postedBy: user })
		.populate("postedBy", "_id username")
		.sort({ createdAt: -1 });
};

module.exports = {
	Query: {
		allPosts,
		postsByUser,
	},
	Mutation: {
		createPost,
	},
};
