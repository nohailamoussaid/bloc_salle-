const mongoose=require('mongoose');
var crenauSchema=new mongoose.Schema({
    hrdebut:{
        type: String,
        required: 'This field is required.'
    },
    hrfin:{
        type: String
    }

});
mongoose.model('Crenau',crenauSchema);