const express = require('express');
const {NoteModel} = require('../model/notes.model');

const {auth} = require('../middleware/auth.middleware')
const noteRouter = express.Router(); 

noteRouter.post('/', auth, async(req, res) => {
   try {
    const note = await NoteModel(req.body);
    await note.save();
        res.send({"msg" : "new note has bee added"});
   } catch (error) {
      console.log("error",error);
   }
})

noteRouter.get('/', auth, async(req, res)=> {
    try {
        const notes = await NoteModel.find({userID : req.body.userID});
        res.send({notes});
    } catch (error) {
        res.send({"error": error});
    }
})
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