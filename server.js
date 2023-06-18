// mongodb
require('./config/db');

const app = require('express')();
const port = 3000;

const UserRouter = require('./api/AppUser');
const TagRouter = require('./api/AppTag.js')
const DiaryRouter = require('./api/AppDiary.js')

// for accepting post form data
const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user', UserRouter);
app.use('/tag', TagRouter);
app.use('/diary', DiaryRouter);

app.listen(port, ()=>{
    console.log(`Server running on port: ${port}`);
})