const monggose = require("mongoose");
const { ObjectId } = monggose.Schema;

const postSchema = new monggose.Schema(
	{
		content: {
			type: String,
			required: "Content is required",
		},
		image: {
			url: {
				type: String,
				default: "https://via.placeholder.com/200x200.png?text=Post",
			},
			public_id: {
				type: String,
				default: Date.now,
			},
		},
		postedBy: {
			type: ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = monggose.model("Post", postSchema);
