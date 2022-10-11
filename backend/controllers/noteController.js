const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');
const Ticket = require('../models/ticketModel');
const Notes = require('../models/noteModel');

// @desc Get notes for a ticket
// @route GET /api/tickets/:ticketId/notes
// @access Private
const getNotes = asyncHandler(async (request, response) => {
    // Get  user using the ID in the JWT
    const user = await User.findById(request.user.id);

    if(!user) {
        response.status(401);
        throw new Error('User not found');
    }

    const ticket = await Ticket.findById(request.params.ticketId);

    if(ticket.user.toString() !== request.user.id) {
        response.status(401);
        throw new Error('User not found');
    }

    const notes = await Notes.find({ticket: request.params.ticketId});

    response.status(200).json(notes);
});

// @desc Create ticket note
// @route POST /api/tickets/:ticketId/notes
// @access Private
const addNote = asyncHandler(async (request, response) => {
    // Get  user using the ID in the JWT
    const user = await User.findById(request.user.id);

    if(!user) {
        response.status(401);
        throw new Error('User not found');
    }

    const ticket = await Ticket.findById(request.params.ticketId);

    if(ticket.user.toString() !== request.user.id) {
        response.status(401);
        throw new Error('User not found');
    }

    const note = await Notes.create({
        ticket: request.params.ticketId,
        text: request.body.text,
        isStaff: false,
        user: request.user.id
    });

    response.status(200).json(note);
});

module.exports = {
    getNotes,
    addNote
}