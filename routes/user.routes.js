const express = require('express');
const {UserModel} = require('../model/user.model');

const userRouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     User:
//  *       type: object
//  *       properties:
//  *         id:
//  *           type: string
//  *           description: The auto-generated id of the user
//  *         name:
//  *           type: string
//  *           description:  the user name
//  *         email:
//  *           type: string
//  *           description: the user email
//  *         age:
//  *           type: integer
//  *           description: age of the user
//  */


// /**
//  * @swagger
//  * /users:
//  *  get:
//  *      summary: This will get all the users data from database
//  *      tags: [Users]
//  *      responses:
//  *          200:
//  *              description: The list of all the users
//  *              content:
//  *                  application/json:
//  *                      schema:
//  *                          type: array
//  *                          item:
//  *                              $ref:"#/components/schemas/User"
//  *          400:
//  *               description: some error occured
//  */
userRouter.get('/', async(req, res)=>{
     try {
        const users = await UserModel.find()
        res.send(users)
     } catch (err) {
        res.send({"error": err});
     }
})
userRouter.post('/register', async(req, res)=> {

    const {username, email, password } = req.body;
    try {
         const existinguser = await UserModel.findOne({email});
         if(existinguser){
            res.status(401).json({msg: "User already exists"});
         } else{
            bcrypt.hash(password, 8, async(err, hash)=>{
                if(err){
                    res.send({err: "error hashing password"});
                }
                else if(hash){
                    const newUser = new UserModel({username, email, password: hash});
                    await newUser.save();
                    res.send({"msg": "User has been registered"});
                }
            })
         }

    } catch (error) {
        console.log("error", error);
    }
})


// /**
//  * @swagger
//  * /users/register:
//  *  post:
//  *      summary: This post the new user details data from database
//  *      tags: [Users]
//  *      requestBody: 
//  *          required: true
//  *          content:
//  *              application/json:
//  *              schema:
//  *                  $ref: "#/components/schemas/User"
//  *      responses:
//  *          200:
//  *              description: To add a new user to list of all the users
//  *              content:
//  *                  application/json:
//  *                      schema:                
//  *                          item:
//  *                              $ref:"#/components/schemas/User"
//  *          400: 
//  *               description: internal server error
//  */


userRouter.post('/login', async(req, res)=>{
    const {email, password} =req.body;
    try {
          const existingUser = await UserModel.findOne({email});
          if(!existingUser){
            res.send({msg: "user doesnt exist"});
          } else{
            bcrypt.compare(password, existingUser.password, (err,result)=> {
                if(result){
                    const token = jwt.sign({userID : existingUser._id}, "masai")
                    res.send({msg: "login successful", token});
                } else if(err){
                    res.send({msg: "wrong credentials", err});
                }
            })
          }
    } catch (error) {
        res.send(error);
    }
})

// /**
// * @swagger
// * /users/{id}:
// *  patch:
// *       summary: Update a user by ID
// *       description: Update an existing user identified by their ID.
// *       parameters:
// *         - name: id
// *           in: path
// *           description: ID of the user to update
// *           required: true
// *           schema:
// *             type: string
// *         - name: body
// *           in: body
// *           description: Data to update the user with
// *           required: true
// *           content:
// *             application/json:
// *               schema:
// *                 $ref: '#/components/schemas/User'
// *       responses:
// *         200:
// *           description: Successfully updated user
// *         404:
// *           description: User not found
// */

userRouter.patch('/:id', async(req,res)=>{
     const {id} = req.params
     try {
          await UserModel.findByIdAndUpdate({_id:id}, req.body);
          res.send({"msg" : "updated the user"});
     } catch (err) {
        res.send({"error":err});
     }
})

// /** 
// * @swagger  
// * /users/{id}:
// *   delete:
// *     summary: Delete a user by ID
// *     description: Delete an existing user identified by their ID.
// *     parameters:
// *       - name: id
// *         in: path
// *         description: ID of the user to delete
// *         required: true
// *         schema:
// *           type: string
// *     responses:
// *       204:
// *         description: User deleted successfully
// *       404:
// *         description: User not found
// *


userRouter.delete('/:id', async(req,res)=>{
    const {id} = req.params
    try {
         await UserModel.findByIdAndDelete({_id:id}, req.body);
         res.send({"msg" : "delete the user"});
    } catch (err) {
       res.send({"error":err});
    }
})

module.exports = {
    userRouter
}