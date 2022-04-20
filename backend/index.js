const connectToMongo = require('./db')    //db.js

const express = require('express')

connectToMongo();

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use(express.json())

app.use('/api/auth',require('./routes/auth'));

//app.use('api/auth',require('./routes/note'))
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

