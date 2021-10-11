const { gql } = require("apollo-server-express");

module.exports = gql`
	type Post {
		_id: ID!
		content: String
		image: Image
		postedBy: User
	}

	type Query {
		allPosts: [Post!]!
		postsByUser: [Post!]!
	}

	# input types
	input CreatePostInput {
		content: String!
		image: ImageInput
	}

	# mutations
	type Mutation {
		createPost(input: CreatePostInput!): Post!
	}
`;
