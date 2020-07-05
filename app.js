const express = require('express');
const bodyParser =require('body-parser');
const mongoose =require('mongoose');
const ejs = require('ejs');

const app=express();

app.set('view engine', ('ejs'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));


mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser:true , 
useUnifiedTopology: true });

const articlesSchema={
    title: String,
    content:String
};

const Article= mongoose.model('Article', articlesSchema);

const article = new Article({
    title:"Hello Bashir",
    content:"this long content but put some here i put later  just wait"
});

///////////////////// Request Targeting all Articles ///////////////// 

app.route('/articles')


.get(function(req, res){

    Article.find(function(err, foundArticeles){
       if(!err){
        res.send(foundArticeles)
       }else{
           res.send(err);
           console.log(err);
           
           
       }

});
})

.post(function(req,res){
 

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err){
        res.send("Successfuly send new article data");
     }else{
         res.send(err);
     }
    });
})

.delete(function(req,res){
    
    Article.deleteMany(function(err){
        if(!err){
            res.send("successfully deleted item");
        }else{
            res.send(err);
        }
    });
    
});

///////////////////// Request Targeting all Articles /////////////////

app.route('/articles/:articleTitle')

.get(function(req,res){
    
 
    Article.findOne({title:req.params.articleTitle}, function(err, result){
        if(result){
            res.send(result);
        }else{
            res.send("No articles was found on the article");
        }
    });

})

.put(function(req,res){
    Article.update(
        {title:req.params.articleTitle}, 
        {title:req.body.title, content:req.body.content},
        {overwrite:true},
        function(err){
            if(!err){
                res.send("Successfully updeted");
            }else{
                res.send("no updeted");
            }
        }
        )
})

.patch(function(req,res){



   Article.update(
       {title:req.params.articleTitle},
       {$set: req.body},
       function(err){
        if(!err){
            res.send("successfully updeted an article.");
        }else{
            res.send(err);
        }
       
       }
   ) 

})

.delete(function(req,res){
    Article.deleteOne(
        {title:req.params.articleTitle},
       
        function(err){
            if(!err){
                res.send("Successfully deleted one item");
            }else{
                res.send(err);
            }
        }
    )
});






app.listen(3000, function(){
    console.log('the the server will be starrt on port 3000');
    
});