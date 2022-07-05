const { updateUser, getMongoUser, addMongoUser, getUsers, signIn } = require("../controllers/usercontroller")
const mongoUser = {
    type: 'object',
    properties: {
        _id: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },


    },
};
const msg = {
    type: 'object',
    properties: {
        message: { type: 'string' }
    }

}

const mongousers = {
    type: 'array',
    properties: {
        // _id: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
    },
}
// const getUserOpts = {
//     schema: {
//         response: {
//             200: {
//                 type: 'array',
//                 Users: user
//             },
//         },
//     },
//     handler: getUsers
// }

const getSingleUserOpts = {
    schema:
    {
        response: {
            200: mongoUser
        }
    },
    handler: getMongoUser
}

const postUserOpts = {

    schema:
    {
        body: {
            type: 'object',
            require: ['username', 'email', 'password'],
            properties: {
                username: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' }
            }
        },
        response:
        {
            201: mongoUser
        },
    },
    handler: addMongoUser
}

// const deleteUserOpts = {
//     schema:
//     {
//         response: {
//             200:{
//             type: 'object',
//             properties: {
//                 message: { type: 'string' }
//             }
//         }



//         }
//     },
//     handler: deleteUser
// }

const updateUserOpts = {
    schema:
    {
        response: {
            200: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string'
                    }
                }
            }
        }
    },
    handler: updateUser
}

const getUserFromMongo = {
    schema:
    {
        response:
        {
            200: mongousers,

        }

    },
    handler: getUsers
}
const loginUserOpts = {

    schema: {
        body: {
            type: 'object',
            properties: {
                email: { type: 'string' },
                password: { type: 'string' }
            }
        },
        response:
        {
            200: {
                type: 'object',
                properties: {
                    token: { type: 'string' },
                    user: {
                        type: 'object',
                        properties: {
                            _id: { type: 'string' },
                            username: { type: 'string' },
                            email: { type: 'string' },
                        }


                    }
                }
            },
            404:msg
        }
    },
    handler: signIn
}


function userRoutes(fastify, options, done) {

    fastify.get("/users/", getUserFromMongo)
    fastify.post("/users/add", postUserOpts)
    fastify.get("/user/:id", getSingleUserOpts)
    fastify.put("/user/update", updateUserOpts)
    fastify.post("/user/login", loginUserOpts)

    // fastify.delete("/mongo/user/delete/:id", deleteUserOpts)




    done();
}

module.exports = userRoutes