const { gql } = require('apollo-server-express');
const {posts} = require('../temp/posts')

// Query
const totalPost = () => posts.length;
const allPosts = () => posts;

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