const mongoose=require('mongoose');
const {Schema}=require('mongoose');
var occupationSchema=new mongoose.Schema({
    date:{
        type:String,
        
    },
    
    crenau: { type: Schema.Types.ObjectId, ref: 'Crenau' },
    crenauhr: { 
        type:String
    },
    salle: { type: Schema.Types.ObjectId, ref: 'Salle' },
    namesalle: { 
        type:String
    }
});
mongoose.model('Occupation',occupationSchema);
module.exports = mongoose.model('Occupation',occupationSchema) ;   
