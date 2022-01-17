const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Occupation = mongoose.model('Occupation');
const Bloc = mongoose.model('Bloc');
const Salle = mongoose.model('Salle');
const Crenau = mongoose.model('Crenau');
router.get('/', (req, res) => {
    Crenau.count({}, function(err, result3) {
    Occupation.count({}, function(err, result2) {
    Salle.count({}, function(err, result1) {
    Bloc.count({}, function(err, result) {
        if (err) {
          res.send(err);
        } else {
            res.render("dashboard/dash", {
                viewTitle: result,
                viewTitle1: result1,
                viewTitle2: result2,
                viewTitle3: result3,
                
                
                
            });
        }
      });
      
        
      });
      
      });
    });
});

router.post('/', (req, res) => {
    res.render("dashboard/dash", {
                
                
                
    });
    
});
module.exports = router;