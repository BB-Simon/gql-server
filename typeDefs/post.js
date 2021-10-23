const { gql } = require("apollo-server-express");

module.exports = gql`
	type Post {
		_id: ID!
		content: String
		image: Image
		postedBy: User
	}

	type Query {
		totalPosts: Int!
		allPosts(page: Int): [Post!]!
		postsByUser: [Post!]!
		singlePost(postId: String!): Post!
	}

	# input types
	input CreatePostInput {
		content: String!
		image: ImageInput
	}
	# input types
	input UpdatePostInput {
		_id: String!
		content: String!
		image: ImageInput
	}

	# mutations
	type Mutation {
		createPost(input: CreatePostInput!): Post!
		updatePost(input: UpdatePostInput!): Post!
		deletePost(postId: String!): Post!
	}
`;
