const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Crenau = mongoose.model('Crenau');

router.get('/api',function(req,res,next){
    Crenau.find({}).then(function(crenau){
        res.send(crenau);
    }).catch(next);
});



router.post('/api',function(req,res,next){
    Crenau.create(req.body).then(function(crenau){
        res.send(crenau);
    }).catch(next);
});


router.get('/', (req, res) => {
    res.render("crenau/addOrEdit", {
        viewTitle: "Insert Crenau"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var crenau = new Crenau();
    
    crenau.hrdebut = req.body.hrdebut;
    crenau.hrfin = req.body.hrfin;
    
    crenau.save((err, doc) => {
        if (!err)
            res.redirect('crenau/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("crenau/addOrEdit", {
                    viewTitle: "Insert Crenau",
                    crenau: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Crenau.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('crenau/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("crenau/addOrEdit", {
                    viewTitle: 'Update Crenau',
                    crenau: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Crenau.find((err, docs) => {
        if (!err) {
            res.render("crenau/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving crenau list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'hrdebut':
                body['hrdebutError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Crenau.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("crenau/addOrEdit", {
                viewTitle: "Update crenau",
                crenau: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Crenau.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/crenau/list');
        }
        else { console.log('Error in crenau delete :' + err); }
    });
});

router.get('/api/list', (req, res) => {
    Crenau.find((err, docs) => {
        if (!err) {
            res.render("crenau/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving crenau list :' + err);
        }
    });
});




router.get('/api/:id', (req, res) => {
    Crenau.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("crenau/addOrEdit", {
                viewTitle: "Update crenau",
                crenau: doc
            });
        }
    });
});

router.get('/api/delete/:id', (req, res) => {
    Crenau.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/crenau/list');
        }
        else { console.log('Error in crenau delete :' + err); }
    });
});


module.exports = router;