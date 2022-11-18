const {StatusCodes} = require('http-status-codes')
const User = require('../models/User')
const {BadRequestError, UnauthenticatedError} = require("../errors");

const register = async (req, res) => {
    const user = await User.create({...req.body})
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({
            user: {
                name: user.name,
                lastName: user.lastName,
                location: user.location,
                email: user.email,
                token
            }
        }
    )
}

const login = async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
        throw new BadRequestError('Please, provide email and password')
    }
    const user = await User.findOne({email})
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({
            user: {
                name: user.name,
                lastName: user.lastName,
                location: user.location,
                email: user.email,
                token
            }
        }
    )
}

const updateUser = async (req, res) => {
    const {
        user: {userId},
        body: {email, name, lastName, location}
    } = req

    if (!email || !name || !lastName || !location) {
        throw new BadRequestError('Please? provide all values')
    }

    const user = await User.findOneAndUpdate({_id: userId}, {
        email, name, lastName, location
    }, {new: true})

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({
            user: {
                name: user.name,
                lastName: user.lastName,
                location: user.location,
                email: user.email,
                token
            }
        }
    )
    res.status(StatusCodes.OK).json({user})
}

module.exports = {
    register,
    login,
    updateUser
}