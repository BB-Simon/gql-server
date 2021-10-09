const { gql } = require('apollo-server-express');
const {posts} = require('../temp/posts');
const {authCheck} = require('../utils/auth');
const {DateTimeResolver} = require('graphql-scalars');

// Query
const totalPost = () => posts.length;
const allPosts = async (parent, args, {req}) => {
    await authCheck(req);
    return posts;
};

// Mutation
const newPost = (parent, args) => {
    console.log(args);

    const {title, description} = args.input;
    // creare new post object
    const post  = {
        id: posts.length + 1,
        title: title,
        description: description,
    }

    // push the new post to the array of posts
    posts.push(post);

    // return the new post
    return post;
}


module.exports = {
    Query: {
        totalPost,
        allPosts
    },
    Mutation: {
        newPost,
    }
}