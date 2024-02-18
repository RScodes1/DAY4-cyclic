const express = require('express');
const {NoteModel} = require('../model/notes.model');

const {auth} = require('../middleware/auth.middleware')
const noteRouter = express.Router(); 

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the note
 *         body:
 *           type: string
 *           description: The body content of the note
 *         userID:
 *           type: string
 *           description: attached from id of the user who created the note
 *         author:
 *           type: string
 *           description: The author of the note taken from username of the user
 */

/**
* @swagger
* /notes:
*  post:
*    summary: Create a new note
*    tags: [Notes]
*    security:
*      - bearerAuth: []
*    requestBody:
*      required: true
*      content:
*        application/json:
*          schema:
*            type: object
*            required:
*              - title
*              - body
*            properties:
*              title:
*                type: string
*                description: The title of the note
*              body:
*                type: string
*                description: The body content of the note
*    responses:
*      201:
*        description: Note created successfully
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                _id:
*                  type: string
*                  description: The ID of the created note
*                title:
*                  type: string
*                  description: The title of the created note
*                body:
*                  type: string
*                  description: The body content of the created note
*                userID:
*                  type: string
*                  description: The ID of the user who created the note
*                author:
*                  type: string
*                  description: The author of the note (taken from user data)
*      400:
*        description: Bad request - Invalid note data
*      401:
*        description: Unauthorized - User not authenticated
*      500:
*        description: Internal server error
*/



noteRouter.post('/', auth, async(req, res) => {
   try {
    const note = await NoteModel(req.body);
    await note.save();
        res.send({"msg" : "new note has bee added"});
   } catch (error) {
      console.log("error",error);
   }
})

/**
* @swagger
* /notes:
*  get:
*    summary: Get all notes for a specific user
*    tags: [Notes]
*    security:
*      - bearerAuth: []
*    responses:
*      200:
*        description: Retrieved notes successfully
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                notes:
*                  type: array
*                  items:
*                    $ref: '#/components/schemas/Note'
*      401:
*        description: Unauthorized - User not authenticated
*      500:
*        description: Internal server error
*/


noteRouter.get('/', auth, async(req, res)=> {
    try {
        const notes = await NoteModel.find({userID : req.body.userID});
        res.send({notes});
    } catch (error) {
        res.send({"error": error});
    }
})

/**
 * @swagger
 * /notes/{id}:
 *  patch:
 *    summary: Update a note by ID
 *    tags: [Notes]
 *    parameters:
 *      - in: path
 *        name: noteId
 *        required: true
 *        description: ID of the note to update
 *        schema:
 *          type: string
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Note'
 *    responses:
 *      200:
 *        description: Note updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  description: Message confirming the update
 *      400:
 *        description: Bad request - Invalid note data or note ID
 *      401:
 *        description: Unauthorized - User not allowed to update the note
 *      404:
 *        description: Not found - Note with provided ID not found
 *      500:
 *        description: Internal server error
 */



noteRouter.patch('/:noteId', auth, async (req, res) => {
    const { noteId } = req.params;
    try {
        const note = await NoteModel.findOne({ _id: noteId });
        if (!note) {
            return res.status(404).send({ msg: `Note with ID ${noteId} not found.` });
        }
        if (note.userID !== req.body.userID) {
            return res.status(403).send({ msg: "You are not allowed to update this note." });
        }
        await NoteModel.findByIdAndUpdate({ _id: noteId }, req.body);
        res.send({ msg: `The note with ID ${noteId} has been updated.` });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Internal server error" });
    }
});

/**
* @swagger
* /notes/{id}:
*  delete:
*      summary: Delete a note by ID
*      tags: [Notes]
*      parameters:
*        - in: path
*          name: noteId
*          required: true
*          description: ID of the note to delete
*          schema:
*            type: string
*      security:
*        - bearerAuth: []
*      responses:
*        200:
*          description: Note deleted successfully
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  msg:
*                    type: string
*                    description: Message confirming the deletion
*        401:  
*           description: Unauthorized - User not allowed to delete the note
*        404:
*           description: Not found - Note with provided ID not found
*        500:
*           description: Internal server error
*/

noteRouter.delete('/:noteId',auth,  async(req, res)=> {
    
       const {noteId} = req.params;
       try {
            const note = await NoteModel.findOne({_id: noteId});
            if(!note){
                return res.status(404).send({msg: `note with id ${noteId} not found`});
            }
            if(note.userID !== req.body.userID){
                return res.status(403).send({"msg" :  "you are not allowed in this "});
            } 
            await NoteModel.findByIdAndDelete({_id: noteId});
           res.send({msg : `note with id ${noteId} has beeen deleted`});
       } catch (error) {
        console.error(error);
        res.status(500).send({msg: "interval server error"});
       }
})


module.exports = {
    noteRouter
}