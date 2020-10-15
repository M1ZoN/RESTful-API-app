const express = require("express")
const ejs = require("ejs")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const PORT = process.env.PORT || 3000;
const ADMIN = process.env.ADMIN
const PASSWORD = process.env.PASSWORD
const DATABASE = process.env.DATABASE;
console.clear();

mongoose.connect("mongodb+srv://" + ADMIN + ":" + PASSWORD + "@cluster0.s3mwb.mongodb.net/" + DATABASE + "?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

const articleSchema = new mongoose.Schema ({
	title: String,
	content: String
})

const Article = mongoose.model("Article", articleSchema)

const app = express()
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

//------------------------Request Targetting All Articles------------------------\\

app.route("/articles")
	 .get((req, res) => {
			Article.find({}, (err, articles) => {
				if (err) {
					res.send(err)
				} else {
					res.send(articles)
				}
			})
		})
   .post((req, res) => {
			let newArticle = new Article({
				title: req.body.title,
				content: req.body.content
			})
			newArticle.save((err) => {
				if (err) {
					res.send(err);
				} else {
					res.send("Successfully added new article.")
				}
			})
		})
		.delete((req, res) => {
			Article.deleteMany({}, (err) => {
				if (err) {
					res.send(err)
				} else {
					res.send("Successfully deleted all data.")
				}
			})
		});

//------------------------Request Targetting Specific Article------------------------\\

app.route("/articles/:articleTitle")
	 .get((req, res) => {
		 Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
			 if (err) {
				 res.send(err)
			 } else {
				 res.send(foundArticle)
			 }
		 })
	 })
	 .put((req, res) => {
		 Article.updateOne({title: req.params.articleTitle}, {title: req.body.title, content: req.body.content}, (err) => {
			 if (err) {
				 res.send(res)
			 } else {
				 res.send("Successfully updated your data.")
			 }
		 })
	 })
	 .patch((req, res) => {
		 Article.updateOne({title: req.params.articleTitle}, { $set: req.body }, (err) => {
			 if (err) {
				 res.send(err)
			 } else {
				res.send("Successfully updated your data entry.")
			 }
		 })
	 })
	 .delete((req, res) => {
		 Article.deleteOne({title: req.params.articleTitle}, (err) => {
			 if (err) {
				 res.send(err)
			 } else {
				  res.send("Successfully deleted specified article.")
			 }
		 })
	 });

app.listen(PORT, () => {
	console.log("Server started on port: " + PORT);
})