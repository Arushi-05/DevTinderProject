const express = require('express')
const app = express()
const PORT = 8000

app.use((req, res, next)=>{
    console.log('Hi console!')
    next()
});

app.get('/', (req, res)=>{
    res.send('Hi from server response!'); 
});
app.listen(PORT, () => {
    console.log(`Hi server port ${PORT}.`)
  })