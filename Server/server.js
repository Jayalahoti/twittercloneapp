const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { MONGODB_URL } = require('./config');

mongoose.connect(MONGODB_URL);

mongoose.connection.on('connected', () => {
    console.log("DB Connected");
});

mongoose.connection.on('error', (err) => {
    console.log(err);
});

app.use(cors());
app.use(express.json());  

require('./models/user_model.js');
require('./models/tweet_model.js');

app.use(require('./routes/user_route.js'));
app.use(require('./routes/tweet_route.js'));
app.use(require('./routes/file_route.js'));

app.listen(5000, () => {
    console.log("Server started!");
})