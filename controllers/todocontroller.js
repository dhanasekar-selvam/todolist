const TodoModel = require("../models/Todos");

const addTodo = (req, reply) => {
    // console.log(req.user);
    console.log(req.body);

    const { taskname, tasks, deadline } = req.body;

    console.log(taskname,tasks,deadline);

    if (!taskname || !tasks || !deadline) {
        reply.code(404).send({ message: "Please Fill All Fields" });

    }
    else {
        const todo = new TodoModel({
            taskname: taskname,
            tasks: tasks,
            deadline: deadline,
            createdBy: req.user
        })

       

        //  console.log(todo);

        TodoModel.findOne({ taskname: taskname }).then(
            (res) => {
                //console.log(res);
                if (res != null) {
                    reply.code(500).send({ message: "taskname already found" })
                }
                else {

                    todo.save().then((res) => {
                        if (res) {
                            reply.code(201).send(res)
                        }
                        else {
                            reply.code(500).send({ message: "Server Error" })
                        }
                    }).catch(err => reply.code(500).send({ message: err }))
                }
            }
        ).catch(err=>reply.code(500).send({message:err}))


    }
}

const getTodos = (req, reply) => {

    TodoModel.find().then(res => {
        if (res) {
            // console.log(res)
            reply.code(200).send(res)
        }
        else {
            reply.code(500).send({ message: "error in fetching todos" })
        }

    }).catch(err => reply.code(500).send({ message: err }))
}


const getMyTodos = (req, reply) => {
     console.log(req.body)
    const id  = req.body._id;
    // console.log(id)

    TodoModel.find({ createdBy: id }).then(res => {
        if (res) {
              console.log(res)
            reply.code(200).send(res)
        }
        else {
            reply.code(500).send({ message: "error in fetching todos" })
        }

    }).catch(err => reply.code(500).send({ message: err }))
}

const getMyParticularTodo = (req, reply) => {
    const { id,taskname } = req.body;

    TodoModel.findOne({ createdBy: id,taskname:taskname })
    .populate("createdBy", "_id username email")
        .exec((err, result) => {
            if (err) {
                return reply.code(500).send(err)
            }
            else {
                console.log(result);
                reply.code(200).send(result)
            }
        })
  //  .catch(err => reply.code(500).send({ message: err }))
}

const updateTodo = (req, reply) => {
    console.log(req.body)
    const { id, taskname, tasks, deadline } = req.body;
    const updTodo = {
        taskname: taskname,
        tasks: tasks,
        deadline: deadline,
    }
    TodoModel.findOneAndUpdate({ _id: id }, updTodo, (err, res) => {
        if (err) reply.code(500).send({ message: "error in updating" });
        else
            return reply.code(200).send({ message: "Update Success" });

    })

}

const updateParticularTask = (req, reply) => {
    console.log("came");
    console.log(req.body);
    const { id, taskname, taskid, isDone } = req.body;
    if (isDone == undefined) {
        console.log("came in")
        TodoModel.updateOne({ _id: id, 'tasks._id': taskid },
            {
                '$set': {
                    'tasks.$.name': taskname
                }
            },
            function (err, res) {
                if (err) {
                    reply.code(500).send({ message: err })
                }

                reply.code(200).send({ message: "update success" })

            })
    }
    else {
        TodoModel.updateOne({ _id: id, 'tasks._id': taskid },
            {
                '$set': {
                    'tasks.$.name': taskname,
                    'tasks.$.isDone': isDone,

                }
            },
            function (err, res) {
                if (err) {
                    reply.code(500).send({ message: err })
                }

                reply.code(200).send({ message: "update success" })

            })
    }
}

//delete a parent task
const deleteTodo = (req, reply) => {
    const { id } = req.body;

    TodoModel.deleteOne({ _id: id }).then(res => {
        if (res)
            reply.code(200).send({ message: "deleted successfully" })

    }).catch(err => reply.code(500).send({ message: err }))
}

const addParticularTask = (req, reply) => {
    const { id, taskname } = req.body;



    TodoModel.findByIdAndUpdate(id, {
        $push: { tasks: { name: taskname } }
    }, { new: true }

    ).populate("createdBy", "_id username email")
        .exec((err, result) => {
            if (err) {
                return reply.code(422).send(err)
            }
            else {
                reply.code(200).send(result)
            }
        })
}

//delete a particular task
// const deleteParticularTask = (req, reply) => {
//     const { id, taskname } = req.body;



//     TodoModel.findByIdAndUpdate(id, {
//         $pull: { tasks: taskname }
//     }, { new: true }

//     ).populate("createdBy", "_id username email")
//         .exec((err, result) => {
//             if (err) {
//                 return reply.code(422).send(err)
//             }
//             else {
//                 reply.code(200).send(result)
//             }
//         })
// }

const deleteParticularTask = (req, reply) => {

    console.log(req.body);
    console.log(req.params);
    const { id, taskid } = req.body;



    TodoModel.findByIdAndUpdate(id, {
        $pull: { tasks: { _id: taskid } }
    }
    , { new: true }
    ).populate("createdBy", "_id username email")
        .exec((err, result) => {
            if (err) {
                return reply.code(422).send(err)
            }
            else {
                reply.code(200).send(result)
            }
        })
}

module.exports = { addTodo, getTodos, getMyTodos, updateTodo, deleteParticularTask, deleteTodo, addParticularTask, updateParticularTask ,getMyParticularTodo}