const express = require('express');
const {ApolloServer} = require('apollo-server-express')
const mongoose = require('mongoose');
const http = require('http');
const path = require('path');
const {makeExecutableSchema} = require("@graphql-tools/schema");
const {mergeTypeDefs, mergeResolvers} = require('@graphql-tools/merge');
const { loadFilesSync } = require("@graphql-tools/load-files");
require('dotenv').config()


// db
const db = async () => {
    try {
        const success = await mongoose.connect(process.env.DATABASE, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false
        })
        console.log('DB Connected');
    } catch (error) {
        console.log('DB connection error', error);
    }
}
// execute database connection
db()




// Types = Query / Mutation / subscription
const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, "./typeDefs")));

// resolvers
const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, "./resolvers")));

const startApolloServer = async (typeDefs, resolvers) => {
    // express server
    const app = express()
    // server
    const httpserver = http.createServer(app)

    // Apollo server
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers
    })

    // More required logic for integrating with Express
    await apolloServer.start()
    // applyMiddleware method connects apollo server to a specific  HTTP freamwork ie: express
    apolloServer.applyMiddleware({app})

    // rest api endpoint
    app.get('/rest', (req, res) =>{
        res.json({
            data: "Hello World!"
        })
    })

    // port
    const PORT = process.env.PORT || 5000;
    httpserver.listen(PORT, () => {
        console.log(`Server is live at port ${PORT}`);
        console.log(`Apollo Server is live at port ${PORT} ${apolloServer.graphqlPath}`);
    })
}

startApolloServer(typeDefs, resolvers)

