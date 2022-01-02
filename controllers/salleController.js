const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Salle = mongoose.model('Salle');
const Bloc = mongoose.model('Bloc');
const qr = require('qrcode'); 
const path = require('path');
var fs = require("fs");
const { url } = require('inspector');


router.get('/api',function(req,res,next){
    Bloc.find((err, docs) => {
        Salle.find({}).then(function(salle){
            res.send(salle);
        }).catch(next);
    });
    
});



router.post('/api',function(req,res,next){
    Salle.create(req.body).then(function(salle){
        res.send(salle);
    }).catch(next);
});


router.get('/', (req, res) => {
    Bloc.find((err, docs) => {
        if (!err) {
            console.log(docs);
            res.render("salle/addOrEdit", {
                blocs: docs,
                viewTitle: "Insert Salle"

            });
        }
        else {
            console.log('Error in retrieving blocs list :' + err);
        }
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    
    var salle = new Salle();
    salle.code = req.body.code;
    salle.libelle = req.body.libelle;
    let s = 
        salle.libelle;
    
    console.log(salle.qrcode);
    let strData = JSON.stringify(s)
    qr.toString(strData, {type:'terminal'},function (err, ur) {
        if(err) return console.log("error occurred")
        console.log("+++++"+ur)
    });
    qr.toDataURL(strData, function (err, ur) {
        salle.qrcode=ur;
        Bloc.findById(req.body.bloc,function(err,docs){
            if (err){
                console.log(err);
            }
            else{
                salle.nameBloc=docs.code
                console.log(docs.name);
                salle.bloc=docs;
                
                salle.save((err, doc) => {
                    if (!err)
                        res.redirect('salle/list');
                    else {
                        if (err.name == 'ValidationError') {
                            handleValidationError(err, req.body);
                            res.render("salle/addOrEdit", {
                                viewTitle: "Insert Salle",
                                salle: req.body,
                                
                            });
                        }
                        else
                            console.log('Error during record insertion : ' + err);
                    }
                });
                console.log("Result : ", docs);
            }
        });
        console.log("Bloc.findById(req.body.hall)");
    
        salle.bloc=Bloc.findById(req.body.hall);
    });
    
    
    
    
    
}
function updateRecord(req, res) {
    Salle.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('salle/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("salle/addOrEdit", {
                    viewTitle: 'Update Salle',
                    salle: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Salle.find((err, docs) => {
        
        
          
        
        if (!err) {
            
                
              
            res.render("salle/list", {
                list: docs,
                
                
                
            });
            
        
        }
        else {
            console.log('Error in retrieving salle list :' + err);
        }
        
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'code':
                body['codeError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Salle.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("salle/addOrEdit", {
                viewTitle: "Update Salle",
                salle: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Salle.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/salle/list');
        }
        else { console.log('Error in salle delete :' + err); }
    });
});


router.put('/api/:id',function(req,res,next){
    Salle.findOneAndUpdate({_id: req.params.id},req.body).then(function(salle){
        Salle.findOne({_id: req.params.id}).then(function(salle){
            res.send(salle);
        });
    });
});


router.delete('/api/:id',function(req,res,next){
    Salle.findOneAndDelete({_id: req.params.id}).then(function(salle){
        res.send(salle);
    });
});

module.exports = router;