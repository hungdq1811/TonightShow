var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var logfmt = require('logfmt');
var path = require('path');

var mongo = require('mongodb');
CollectionDriver = require('./collectionDriver').CollectionDriver;

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var mongoUri = 'mongodb://hungdq:tonightshow@kahana.mongohq.com:10031/tonight-show';
var collectionDriver;

mongo.Db.connect(mongoUri, function(error, db){
    if (error) console.log("Error: Unable to connect to database");
    else {
        console.log("Connected to Database");
        collectionDriver = new CollectionDriver(db);
    }
});

app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.send('<html><body><h1>Hello World!</h1></body></html>');
});

app.get('/:collection', function(req, res, next){
    var params = req.params;
    var query = req.query.query;
    if (query){
        query = JSON.parse(query);
        collectionDriver.query(req.params.collection, query, returnCollectionResults(req, res));
    }
    else {
        collectionDriver.findAll(req.params.collection, returnCollectionResults(req, res));
    }
});

function returnCollectionResults(req, res){
    return function(error, objs){
        if (error) res.send(400, error);
        else {
            if (req.accepts('html')){
                res.render('data', {objects:objs, collection:req.params.collection});
            }
            else {
                res.set('Content-Type', 'application/json');
                res.send(200, objs);
            }
        }
    };
};

app.get('/:collection/:entity', function(req, res){
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity){
        collectionDriver.get(collection, entity, function(error, objs){
            if (error) res.send(400, error);
            else res.send(200, objs);
        });
    }
    else {
        res.send(400, {error:'bad url', url:req.url});
    }
});

app.post('/:collection', function(req, res){
    var object = req.body;
    var collection = req.params.collection;
    collectionDriver.save(collection, object, function(error, docs){
        if (error) res.send(400, error);
        else res.send(201, docs);
    });
});

app.put('/:collection/:entity', function(req, res){
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity){
        collectionDriver.update(collection, req.body, entity, function(error, objs){
            if (error) res.send(400, error);
            else res.send(200, objs);
        });
    }
    else {
        var error = {'message' : 'Cannot PUT a whole collection'};
        res.send(400, error);
    }
});

app.delete('/:collection/:entity', function(req, res){
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity){
        collectionDriver.delete(collection, entity, function(error, objs){
            if (error) res.send(400, error);
            else res.send(200, objs);
        });
    }
    else {
        var error = {'message' : 'Cannot DELETE a whole collection'};
        res.send(400, error);
    }
});

app.use(function(req, res){
    res.render('404', {url: req.url});
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

