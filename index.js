const express = require('express');
const app = express();
require('dotenv').config();
const { connection } = require('./config/db');
const { userRouter } = require('./routes/user.routes');
const { noteRouter } = require('./routes/note.routes');

// const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUI = require("swagger-ui-express")

// const options = {
//     definition: {
//       openapi: '3.0.0',
//       info: {
//         title: 'User Management World',
//         version: '1.3.0',
//       },
//       servers:[
//         {
//           url:"http://localhost:8080/"
//         },
//         {
//           url:"http://wwww.example.com"
//         }
//       ]
//     },
//     apis: ['./routes/*.js'], 
// };

// const openapiSpecification = swaggerJsdoc(options);

// app.use('/apidocs', swaggerUI.serve, swaggerUI.setup(openapiSpecification));


app.use(express.json());
app.use('/users', userRouter);
app.use('/notes', noteRouter);


app.get('/',(req,res)=>{
    res.send({msg : "server has started"});
})

app.listen(process.env.port, ()=>{
      // try {
        // await connection
        // console.log('mongodb started');
        console.log(`server is running on port ${process.env.port}`);
      // } catch (error) {
      //   console.log(error);
      // }
})