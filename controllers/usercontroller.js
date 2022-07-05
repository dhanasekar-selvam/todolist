var UserModel = require("../models/Users");
const bcrypt = require('bcrypt');
require('dotenv').config()
const jwt = require('jsonwebtoken');

// const getUsers=(req,reply)=>{
//     reply.send(Users);
// }

// const getUser=(req,reply)=>{
//     const{id}=req.params;

//         const user=Users.find((user)=>user.id===id)

//         reply.send(user);
// }
function find(email) {
    console.log(email);
    const data = UserModel.findOne({ email: email }).then((response) => {
        // console.log(response);
        return response
    }).catch(err => { return err })

    return data;
}
const getMongoUser = async (req, res) => {
    // console.log("finduser");
    const { email } = req.params;
    const result = await find(email);
    console.log(result);

    if (result != null) {
        res.code(200).send(result);
    } else {
        res.code(404).send({ message: "user not found!" })
    }
}

const getUsers = (req, reply) => {
    UserModel.find().then((res) => {
        if (res) {
            console.log(res)
            reply.code(200).send(res)

        }
    }).catch(err => reply.send({ message: "no users available" }))
}

const signIn = async (req, reply) => {
    const { email, password } = req.body;


    const user = await find(email)

    const hashPassword = user.password;

    if (user != null) {
        bcrypt.compare(password, hashPassword).then(function (result) {
            if (result == true) {
                // res.status(200).json(user);

                const token = jwt.sign({ _id: user._id }, process.env.jwt_secret);
                const { _id, username, email } = user
                console.log(user)
                console.log(token)
                req.user = user
                reply.code(200).send({ token, user: { _id, username, email } });
            }
            else {
                reply.code(404).send({ message: "invalid user" })
            }

        });
    }
    else {
        reply.code(404).send({ message: "user not found" })
    }
    // reply.send=true;
}



// const addUser=(req,reply)=>{
//     const{name}=req.body;
//     const user={
//         id:uuidv4(),
//         name
//     }

//     Users=[...Users,user];

//     reply.code(201).send(Users);
// }

// const deleteUser=(req,reply)=>{
//     const {id}=req.params;

//     Users=Users.filter((user)=>user.id!=id);

//     reply.send({message:`the item${id} had been deleted`});
// }

const updateUser = async (req, reply) => {
    console.log(req.body)
    const { _id, username, email } = req.body;


    const newUser = ({

        username: username,
        email: email
    })
    console.log(newUser)

    UserModel.findOneAndUpdate({ _id: _id }, newUser, function (err) {
        if (err) return reply.send(500, { message: err });
        return reply.send({ message: 'Succesfully saved.' });
    });

}


const addMongoUser = (req, reply) => {
    const saltRounds = 10;
    // console.log(req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        reply.code(404).send({ message: "please fill all the fields" })
    }

    //check user avail
    UserModel.findOne({ email: email })
        .then((isfound) => {
            if (isfound) { return reply.code(422).send({ message: "user already found" }) }
            bcrypt.hash(password, saltRounds).then(function (hash) {
                const user = new UserModel({
                    username,
                    email,
                    password: hash,

                })
                user.save()
                    .then(user => {
                        reply.send({ message: "saved successfully", user: user })
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            });




        }
        )



}

// const deleteUser = (req, reply) => {
//     const { id } = req.params;

//     UserModel.deleteOne({ _id: id }).then((res) => {
//         if (res)
//             reply.send({ message: "deleted sucessfully" })
//     }).catch(err => reply.send({ message: err }))
// }


module.exports = {
    signIn,
    getUsers,
    updateUser,
    getMongoUser,
    addMongoUser,
    // deleteUser
}