
const express = require('express')
const router = express.Router();
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

// ROUTE 1: fetch all the notes
router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.log(error.mesage);
        res.status(500).json({ errors: "some error occured" });
    }
})

//Route 2 : create or add notes
router.post('/addnote', fetchuser, [
    body('title', 'Enter valid title').isLength({ min: 3 }),
    body('description', 'Enter valid description').isLength({ min: 3 }),
], async (req, res) => {

    try {
        const { title, description, tag } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        })

        const savedNote = await note.save()

        res.json(savedNote)
    } catch (error) {
        console.log(error.mesage);
        res.status(500).json({ errors: "some error occured" });
    }

})

//Route 3: Update note   
router.put('/updatenote/:id', fetchuser, async(req,res)=>{
    const {title, description, tag} = req.body;

    try{
        const newNote= {};
        if(title){ newNote.title = title};
        if(description) {newNote.description = description};
        if(tag) {newNote.tag = tag};

        let note = Note.findById(req.params.id)

        if(!note) {return res.status(404).send("Note not found")}

        
        
    }catch (error) {
        console.log(error.mesage);
        res.status(500).json({ errors: "some error occured" });
    }


})





module.exports = router

