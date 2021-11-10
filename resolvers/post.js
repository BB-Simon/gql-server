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
	const currentPage = args.page || 1;
	const perPage = 3;
	return await Post.find({})
		.skip((currentPage -1) * perPage)
		.limit(perPage)
		.sort({ createdAt: -1 })
		.populate("postedBy", "_id username")
		.exec();
};

const singlePost = async (_, args) => {
	return await Post.findById({ _id: args.postId })
		.populate("postedBy", "_id username")
		.exec();
};

const postsByUser = async (_, args, { req }) => {
	const currentUser = await authCheck(req);
	const user = await User.findOne({ email: currentUser.email }).exec();
	return await Post.find({ postedBy: user })
		.populate("postedBy", "_id username")
		.sort({ createdAt: -1 });
};

const updatePost = async (_, args, { req }) => {
	const currentUser = await authCheck(req);

	// validate
	if (args.input.content.trim() === "")
		throw new Error("Conetent is required!");

	// get user from db based on currentUser email
	const user = await User.findOne({ email: currentUser.email }).exec();

	// get the post by _id to update
	const postToUpdate = await Post.findById({ _id: args.input._id }).exec();

	// if post' postedByUser's _id and user's _id is same, allow to update
	if (user._id.toString() !== postToUpdate.postedBy._id.toString())
		throw new Error("Unauthorized action!");
	const updatedPost = await Post.findByIdAndUpdate(
		args.input._id,
		{ ...args.input },
		{ new: true }
	)
		.exec()
		.then((post) => post.populate("postedBy", "_id username"));

	return updatedPost;
};
const deletePost = async (_, args, { req }) => {
	const currentUser = await authCheck(req);

	// get user from db based on currentUser email
	const user = await User.findOne({ email: currentUser.email }).exec();

	// get the post by _id to delete
	const postToDelete = await Post.findById({ _id: args.postId }).exec();

	// if post' postedByUser's _id and user's _id is same, allow to update
	if (user._id.toString() !== postToDelete.postedBy._id.toString())
		throw new Error("Unauthorized action!");
	const deletedPost = await Post.findByIdAndDelete({ _id: args.postId }).exec();

	return deletedPost;
};

const totalPosts = async (_, args) =>
	await Post.find({}).estimatedDocumentCount().exec();

const search = async (_, {query}) => {
	return await Post.find({$text: {$search: query}})
		.populate('postedBy', "username")
		.exec();
}

module.exports = {
	Query: {
		totalPosts,
		allPosts,
		postsByUser,
		singlePost,
		search
	},
	Mutation: {
		createPost,
		updatePost,
		deletePost,
	},
};
