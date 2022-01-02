const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Occupation = mongoose.model('Occupation');

const Salle = mongoose.model('Salle');
const Crenau = mongoose.model('Crenau');

router.get('/api',function(req,res,next){
    Crenau.find((err, docs) => {
        Salle.find((err, docs) => {
            Occupation.find({}).then(function(occupation){
                res.send(occupation);
            }).catch(next);
        });

    });

    
    
});



router.post('/api',function(req,res,next){
    Occupation.create(req.body).then(function(occupation){
        res.send(occupation);
    }).catch(next);
});


router.get('/', (req, res) => {
    Crenau.find((err, docss) => {
        Salle.find((err, docs) => {
            if (!err) {
                console.log(docs);
                console.log(docss);
                res.render("occupation/addOrEdit", {
                    
                    salles: docs,
                    crenaus:docss,
                    viewTitle: "Insert occupation"
    
                });
            }
            else {
                console.log('Error in retrieving salles list :' + err);
            }
        });
    });
    
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var occupation = new Occupation();
    occupation.date = req.body.date;
    Crenau.findById(req.body.crenau,function(err,docss){
        Salle.findById(req.body.salle,function(err,docs){
            if (err){
                console.log(err);
            }
            else{
                occupation.namesalle=docs.libelle
                occupation.crenauhr=docss.hrdebut+" to "+docss.hrfin


                
                occupation.salle=docs;
                occupation.crenau=docss;
                occupation.save((err, doc) => {
                    if (!err)
                        res.redirect('occupation/list');
                    else {
                        if (err.name == 'ValidationError') {
                            handleValidationError(err, req.body);
                            res.render("occupation/addOrEdit", {
                                viewTitle: "Insert occupation",
                                occupation: req.body
                            });
                        }
                        else
                            console.log('Error during record insertion : ' + err);
                    }
                });
                console.log("Result : ", docs);
            }
        });
    });
    
    
   

    occupation.salle=Salle.findById(req.body.hall);
    occupation.crenau=Crenau.findById(req.body.hall);
    
    
}

function updateRecord(req, res) {
    Occupation.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('occupation/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("occupation/addOrEdit", {
                    viewTitle: 'Update occupation',
                    occupation: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}
router.get('/list', (req, res) => {
    Occupation.find((err, docs) => {
        if (!err) {
            res.render("occupation/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving occupation list :' + err);
        }
    });
});
function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'date':
                body['dateError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}
router.get('/:id', (req, res) => {
    Occupation.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("occupation/addOrEdit", {
                viewTitle: "Update occupation",
                occupation: doc
            });
        }
    });
});
router.get('/cher/:id', (req, res) => {
    Occupation.find({ salle : req.params.id }).exec(function (err, occupations) {
        if (err){ return handleError(err);}
        else{
            res.render("salle/cher", {
                
                list:occupations
                

                    
                
            });
            

        }
  // returns all stories that have Bob's id as their author.
    });
    
    
    
    
});
router.get('/delete/:id', (req, res) => {
    Occupation.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/occupation/list');
        }
        else { console.log('Error in occupation delete :' + err); }
    });
});


router.put('/api/:id',function(req,res,next){
    Occupation.findOneAndUpdate({_id: req.params.id},req.body).then(function(occupation){
        Occupation.findOne({_id: req.params.id}).then(function(occupation){
            res.send(occupation);
        });
    });
});


router.delete('/api/:id',function(req,res,next){
    Occupation.findOneAndDelete({_id: req.params.id}).then(function(occupation){
        res.send(occupation);
    });
});

module.exports = router;