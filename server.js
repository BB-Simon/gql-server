const express = require("express");
const { ApolloServer, PubSub } = require("apollo-server-express");
const mongoose = require("mongoose");
const http = require("http");
const path = require("path");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { loadFilesSync } = require("@graphql-tools/load-files");
const cors = require("cors");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const { authCheck, authCheckMiddleware } = require("./utils/auth");

// db
const db = async () => {
	try {
		const success = await mongoose.connect(process.env.DATABASE, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			// useCreateIndex: true,
			// useFindAndModify: false
		});
		console.log("DB Connected");
	} catch (error) {
		console.log("DB connection error", error);
	}
};
// execute database connection
db();

// Types = Query / Mutation / subscription
const typeDefs = mergeTypeDefs(
	loadFilesSync(path.join(__dirname, "./typeDefs"))
);

// resolvers
const resolvers = mergeResolvers(
	loadFilesSync(path.join(__dirname, "./resolvers"))
);

const startApolloServer = async (typeDefs, resolvers) => {
	const pubsub = new PubSub();
	// express server
	const app = express();

	// middlewares
	app.use(cors());
	app.use(express.json({ limit: "5mb" }));

	// server
	const httpserver = http.createServer(app);

	// Apollo server
	const apolloServer = new ApolloServer({
		typeDefs,
		resolvers,
		context: ({ req, pubsub }) => ({ req, pubsub }),
	});

	// More required logic for integrating with Express
	await apolloServer.start();
	// applyMiddleware method connects apollo server to a specific  HTTP freamwork ie: express
	apolloServer.applyMiddleware({ app });

	// rest api endpoint
	app.get("/rest", authCheckMiddleware, (req, res) => {
		res.json({
			data: "Hello World!",
		});
	});

	// cloudinay config
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});

	// upload images to cloudinary server
	app.post("/uploadimage", authCheckMiddleware, async (req, res) => {
		try {
			const result = await cloudinary.uploader.upload(req.body.image, {
				public_id: `${Date.now()}`, // public name
				resource_type: "auto", // JPEG, PNG
			});

			res.send({
				url: result.secure_url,
				public_id: result.public_id,
			});
		} catch (error) {
			console.log("coudinary  upload error", error);
		}
	});

	// remove image from cloudinary
	app.post("/removeimage", authCheckMiddleware, async (req, res) => {
		const image_id = req.body.public_id;
		try {
			const result = await cloudinary.uploader.destroy(image_id);
			res.send("ok");
		} catch (error) {
			console.log("coudinary error", error);
			res.json({ success: false, error });
		}
	});

	// port
	const PORT = process.env.PORT || 5000;
	httpserver.listen(PORT, () => {
		console.log(`Server is live at port ${PORT}`);
		console.log(
			`Apollo Server is live at port ${PORT} ${apolloServer.graphqlPath}`
		);
	});
};

startApolloServer(typeDefs, resolvers);
