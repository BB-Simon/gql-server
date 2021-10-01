const express = require('express');
require('dotenv').config()

// express server
const app = express()

// rest api endpoint
app.get('/rest', (req, res) =>{
    res.json({
        data: "Hello World!"
    })
})

// port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is live at port ${PORT}`);
})