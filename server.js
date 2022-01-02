require('./models/db');
const express = require('express');
const path = require('path');
const {Socket}=require('socket.io');   
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const bodyparser = require('body-parser');
const Occupation = require('./models/occupation.model');
const QRCode = require('qrcode');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const blocController = require('./controllers/blocController');
const salleController = require('./controllers/salleController');
const crenauController = require('./controllers/crenauController');
const occupationController = require('./controllers/occupationController');
var app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);
io.on('connection', (socket) => {
    console.log('user connected');
    const changeStream = Occupation.watch();
    changeStream.on('change', next => {
        const resumeToken = changeStream.resumeToken;
        const operation = next.operationType;

        if (next.operationType === 'insert') {
            //  console.log(next.fullDocument._idSalle)
            socket.emit("test",  next.fullDocument.date, next.fullDocument.namesalle, next.fullDocument.crenauhr);
            

        }
    });

})
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
app.set('view engine', 'hbs');

http.listen(process.env.PORT || 3000, () => {
    console.log('Express server started at port :3000');
});
app.use('/bloc', blocController);
app.use('/salle', salleController);
app.use('/crenau', crenauController);
app.use('/occupation', occupationController);