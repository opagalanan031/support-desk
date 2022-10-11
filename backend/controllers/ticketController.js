const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');
const Ticket = require('../models/ticketModel');

// @desc Get user tickets
// @route GET /api/tickets
// @access Private
const getTickets = asyncHandler(async (request, response) => {
    // Get  user using the ID in the JWT
    const user = await User.findById(request.user.id);

    if(!user) {
        response.status(401);
        throw new Error('User not found');
    }

    const tickets = await Ticket.find({user: request.user.id})

    response.status(200).json(tickets);
});

// @desc Get user ticket
// @route GET /api/tickets/:id
// @access Private
const getTicket = asyncHandler(async (request, response) => {
    // Get  user using the ID in the JWT
    const user = await User.findById(request.user.id);

    if(!user) {
        response.status(401);
        throw new Error('User not found');
    }

    const ticket = await Ticket.findById(request.params.id);

    if(!ticket) {
        response.status(404);
        throw new Error('Ticket not found');
    }

    if(ticket.user.toString() !== request.user.id) {
        response.status(401);
        throw new Error('Not Authorized');
    }

    response.status(200).json(ticket);
});

// @desc Create new ticket
// @route POST /api/tickets
// @access Private
const createTicket = asyncHandler(async (request, response) => {
    const {product, description} = request.body;

    if(!product || !description) {
        response.status(400);
        throw new Error('Please add a product and description');
    }

     // Get  user using the ID in the JWT
     const user = await User.findById(request.user.id);

     if(!user) {
         response.status(401);
         throw new Error('User not found');
     }

     const ticket = await Ticket.create({
        product,
        description,
        user: request.user.id,
        status: 'new'
     });

    response.status(201).json(ticket);
});

// @desc Delete user ticket
// @route DELETE /api/tickets/:id
// @access Private
const deleteTicket = asyncHandler(async (request, response) => {
    // Get  user using the ID in the JWT
    const user = await User.findById(request.user.id);

    if(!user) {
        response.status(401);
        throw new Error('User not found');
    }

    const ticket = await Ticket.findById(request.params.id);

    if(!ticket) {
        response.status(404);
        throw new Error('Ticket not found');
    }

    if(ticket.user.toString() !== request.user.id) {
        response.status(401);
        throw new Error('Not Authorized');
    }

    await ticket.remove();

    response.status(200).json({success: true});
});

// @desc Update user ticket
// @route PUT /api/tickets/:id
// @access Private
const updateTicket = asyncHandler(async (request, response) => {
    // Get  user using the ID in the JWT
    const user = await User.findById(request.user.id);

    if(!user) {
        response.status(401);
        throw new Error('User not found');
    }

    const ticket = await Ticket.findById(request.params.id);

    if(!ticket) {
        response.status(404);
        throw new Error('Ticket not found');
    }

    if(ticket.user.toString() !== request.user.id) {
        response.status(401);
        throw new Error('Not Authorized');
    }

    const updatedTicket = await Ticket
        .findByIdAndUpdate(request.params.id, request.body, {new: true});

    response.status(200).json(updatedTicket);
});

module.exports = {
    getTickets,
    getTicket,
    createTicket,
    deleteTicket,
    updateTicket
}