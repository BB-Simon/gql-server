const { gql } = require('apollo-server-express');

module.exports = gql`
    #sclar type
    scalar DateTime

    type Image {
        url: String
        public_id: String
    }

    type User {
        _id: ID!
        username: String
        name: String
        email: String
        images: [Image]
        about: String
        createdAt: DateTime
        updatedAt: DateTime
    }

    type CreateUserResponse {
        username: String!
        email: String!
    }

    #input type
    input ImageInput {
        url: String!
        public_id: String
    }
    #input type
    input UserUpdateInput {
        username: String
        name: String
        images: [ImageInput]
        about: String
        email: String
    }

    type Query {
        profile: User!
    }

    type Mutation {
        createUser: CreateUserResponse!
        updateUser(input: UserUpdateInput): User!
    } 
`