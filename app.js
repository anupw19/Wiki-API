

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = ({
    title: String,
    content: String
});

const Article = mongoose.model("Article",articleSchema);

/////////////////////////////////////////////////////REQUEST TARGETTING A ARTICLES///////////////////////////////////////////////////////////////

app.route("/articles")
.get(function(req,res){

    Article.find({}).then(function(foundArticles){
        res.send(foundArticles);   
 }).catch(function(err){
        console.log(err);
    });
})

.post(function(req,res){

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save().then(function(){
        res.send("Successfully added new article");
    }).catch(function(err){
        res.send(err);
    });
})

.delete(function(req,res){
    Article.deleteMany().then(function(req,res){
        res.send("Successfully deleted all articles");
     }).catch(function(err){
        res.send(err)
     })
})

/////////////////////////////////////////////////////REQUEST TARGETTING A SPECFIC ARTICLES//////////////////////////////////////////////////////////

app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title: req.params.articleTitle}).then(function(foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No matching article for give title!");
        }
    }).catch(function(err){
        res.send(err);
    })
})

.put(function(req,res){
    Article.updateOne(
        {title : req.params.articleTitle},
        {title: req.body.title , content: req.body.content},
    ).then(function(){
        res.send("Successfully Updated!");
    }).catch(function(err){
        res.send(err);
    })
})

.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body}
    ).then(function(){
        res.send("Successfully updated!")
    }).catch(function(err){
        res.send(err)
    })
})

.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle}
    ).then(function(req,res){
        res.send("Successfully deleted the given article!");
    }).catch(function(err){
        res.send(err);
    })
});




app.listen(3000,function(){
    console.log("server  started on port 3000");
})
