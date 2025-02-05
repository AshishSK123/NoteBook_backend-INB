const express = require('express')
const Router = express.Router();
const Notes = require('../model/Notes')
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');
const { encrypt, decrypt } = require('n-krypta');
const e = require('express');


const secretkey = 'Ashishsk@18'


//ROUTE 1; To fetch the user notes // using middleware function // using GET: api/Notes/Notesdata
Router.get('/Notesdata', fetchuser, async (req, res) => {
    try {

        //To fetch the user notes using user id recieved from middleware function
        const notes = await Notes.find({ user: req.user_id })
        notes.forEach((note) => {

            //To decrypt the data before sending to client side
            const decrypted_title = decrypt(note.title, secretkey)
            const decrypted_description = decrypt(note.description, secretkey)

            note.title = decrypted_title
            note.description = decrypted_description
        })
        res.json(notes)
    } catch (error) {

        // To display error
        console.log(error)
        res.status(500).send("Please Try after some Time!")
    }
})

//ROUTE 2; To add the notes // using POST: api/Notes/addnotes 
//Using express-validar to check fields are not empty 
Router.post('/addnote', fetchuser, [
    body('title', 'Title can not be blank').notEmpty(),
    body('description', 'Please add description').notEmpty()
], async (req, res) => {

    //If validation fails return error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(400).json({ errors: errors.array() });
        return res.status(400).json({ errors: errors.errors[0].msg });
    }

    // destructing to get data from req.body
    const { title, description, tag } = req.body
    try {

        //To encrypt the data before storing into database
        const encrypted_description = encrypt(description, secretkey)
        const encrypted_title = encrypt(title, secretkey)

        // To get the data from user for each field and store it  
        const note = new Notes({
            title: encrypted_title, description: encrypted_description, tag, user: req.user_id
        })
        // To save the data into database
        const savenote = await note.save()

        // console.log(savenote)
        res.json(savenote)
    } catch (error) {
        //To display error
        console.log(error)
        res.status(500).send("Please Try after some Time!")
    }

})


//ROUTE 3; To find and update note // using PUT: /api/Notes/updatenote/:id
//:id is an id of a particular note
Router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body


    try {

        // initializing new data object as empty
        let newNote = {}
        // To Check if there is new data and update
        if (title) { newNote.title = encrypt(title, secretkey) }
        if (description) { newNote.description = encrypt(description, secretkey) }
        if (tag) { newNote.tag = tag }


        // To fetch the note using note id provided in url // params.id gets the id from url 
        let note = await Notes.findById(req.params.id)

        //To check note is Present or Not
        if (!note) { return res.status(401).send("Notes not found") }

        // To authenticate note owner
        //toString() funcation used to convert user object into plain text
        if (note.user.toString() !== req.user_id) { return res.status(401).send("Please try again") }

        //Model.findByIdAndUpdate(id, update, options, callback);
        // id: The ID of the document you want to update.
        // update: An object containing the fields and values you want to update.
        // options: (Optional) An object specifying options such as new, upsert, runValidators, etc.
        //          new: If set to true, returns the modified document rather than the original. Defaults to false.
        // callback: (Optional) A callback function that is called after the update is complete. Alternatively, you can use .then() and .catch() for promises.
        // $set: is used to update or add the fields of document with values provided in newNote 
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note)
    } catch (error) {

        // To display err
        console.log(error)
        res.status(500).send("Please Try after some Time!")
    }

})

//ROUTE 4; TO find and delete note using note id // DELETE: /api/Notes/deletenote/:id
Router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {

        // To fetch the note using note id provided in url // params.id gets the id from url 
        let note = await Notes.findById(req.params.id)

        //To check note is Present or Not
        if (!note) { return res.status(401).send("Notes not found") }

        // To authenticate note owner
        //toString() funcation used to convert user object into plain text
        if (note.user.toString() !== req.user_id) { return res.status(401).send("Please try again") }

        //To delete the note using note id
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ title: note.title, report: "has been deleted" })


    } catch (error) {

        // To display err
        console.log(error)
        res.status(500).send("Please Try after some Time!")
    }
})
module.exports = Router