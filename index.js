const express = require('express');
const    cors = require('cors');

const { connection } = require('./config/db');
const { userRouter } = require('./routes/user.routes');
const { noteRouter } = require('./routes/note.routes');


require('dotenv').config();
const app = express();
app.use(express.json());

app.use(cors());
app.use('/users', userRouter);
app.use('/notes', noteRouter);

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


app.get('/',(req,res)=>{
    res.send({msg : "server has started"});
})

app.listen(process.env.port, async()=>{
      try {
        await connection
        console.log('mongodb started');
        console.log(`server is running on port ${process.env.port}`);
      } catch (error) {
        console.log(error);
      }
})