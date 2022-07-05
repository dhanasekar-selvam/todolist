const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users")
require('dotenv').config()
module.exports =
    (request, reply, next) => {
        const { authorization } = request.headers
        if (!authorization) {
            return reply.code(401).send({ message: "you must logged in" })
        }
        const token = authorization.replace("Bearer ", "")
        // console.log(token);
        jwt.verify(token, process.env.jwt_secret, (err, payload) => {
            if (err) {
                return reply.code(401).send({ message: "you must be logged in" })
            }
            const { _id } = payload
            UserModel.findById(_id).then((userData) => {
                request.user = userData;
                next();

            })
        })
    }


