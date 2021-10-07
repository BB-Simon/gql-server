const { gql } = require('apollo-server-express');

module.exports = gql`
    type CreateUserResponse {
        username: String!
        email: String!
    }

    type Mutation {
        createUser: CreateUserResponse!
    } 
`