const mongoose =require('mongoose');

mongoose.connect('mongodb+srv://rootr:root@cluste.laymn.mongodb.net/test',{useNewUrlParser : true},(err) => {
if (!err){console.log('Mongo Db Connection Succed')}
else{console.log('error in db connection:'+err)}


});
require('./bloc.model');
require('./salle.model');
require('./crenau.model');
require('./occupation.model');