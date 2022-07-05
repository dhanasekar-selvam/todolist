const app = require('fastify')({ logger: true });
app.register(require("../middleware/requiredLogin"))

const { addTodo, getTodos, getMyTodos, updateTodo, deleteTodo, deleteParticularTask, addParticularTask, updateParticularTask, getMyParticularTodo } = require("../controllers/todocontroller");
const requiredLogin = require("../middleware/requiredLogin");
const todoOpt = {
    type: 'object',
    properties: {
        taskname: { type: 'string' },
        tasks: { type: 'array' },
        deadline: {
            type: 'string'
        }
    }

}

const msg = {
    type: 'object',
    properties: {
        message: { type: 'string' }
    }

}

const addtodo = {
    schema:
    {
        body:
        {
            type: 'object',
            require: ['taskname', 'tasks', 'deadline'],
            properties: {
                taskname: { type: 'string' },
                tasks: { type: 'array' },
                deadline: { type: 'string' },


            },
        },
        response: {
            201: todoOpt,
            500: msg
        }
    },
    preHandler: requiredLogin,
    handler: addTodo
}

const gettodo = {
    schema: {
        response: {
            200: {
                type: 'array',
                properties: {
                    taskname: { type: 'string' },
                    tasks: { type: 'array' },
                    deadline: {
                        type: 'string'
                    }
                }
            },
            500: msg
        }
    },
    handler: getTodos
}

const getUsertodo = {
    schema: {
        response: {
            200: { ...todoOpt, type: 'array' },
            500: msg
        }
    },
    preHandler: requiredLogin,
    handler: getMyTodos
}

const updatetodo = {
    schema: {
        body: {
            type: 'object',
            properties: {
                _id: { type: 'string' },
                taskname: { type: 'string' },
                tasks: { type: 'array' },
                deadline: { type: 'string' },

            },
        },
        response: {
            200: msg,
            500: msg,
        },
    },
    preHandler: requiredLogin,
    handler: updateTodo

}
const get_my_particular_todo = {
    schema: {
        response: {
            200:
            {
                ...todoOpt, properties: {
                    taskname: { type: 'string' },
                    tasks: { type: 'array' },
                    deadline: {
                        type: 'string'
                    },
                    createdBy: {
                        type: 'object',
                        properties: {
                            _id: { type: 'string' },
                            username: { type: 'string' },
                            email: { type: 'string' },
                        }
                    },
                }
            },
            500: msg

        },

    },
    preHandler: requiredLogin,
    handler: getMyParticularTodo
}

//updating particulartask
const update_particular_task_opts = {
    schema: {
        body: {
            type: 'object',
            properties: {
                taskname: { type: 'string' },
                id: { type: 'string' },
                taskid: { type: 'string' },
                isDone: { type: 'boolean' },

            },
        },
        response: {
            200: msg,
            500: msg,
        },
    },
    preHandler: requiredLogin,
    handler: updateParticularTask

}


const deletetodo = {
    schema: {
        body: {
            type: 'object',
            properties: {
                _id: { type: 'string' },

            },
        },
        response: {
            200: msg,
            500: msg

        }
    },
    preHandler: requiredLogin,
    handler: deleteTodo

}

const deletetodotask = {
    schema: {
        body: {
            type: 'object',
            properties: {
                parentId: { type: 'string' },
                childId: { type: 'string' }
            },
        },
        response: {
            200: {
                type: "object",
                properties: {
                    createdBy: {
                        type: 'object',
                        properties: {
                            _id: { type: 'string' },
                            username: { type: 'string' },
                            email: { type: 'string' },
                        }
                    },
                    taskname: { type: 'string' },
                    tasks: { type: 'array' },
                    deadline: {
                        type: 'string'
                    }
                }
            },
            422: msg

        },
    },
    preHandler: requiredLogin,
    handler: deleteParticularTask
}


const addparticulartodo = {
    schema: {
        body: {
            type: 'object',
            properties: {
                _id: { type: 'string' },
                taskname: { type: 'string' },


            },
        },
        response: {
            200: {
                type: "object",
                properties: {
                    createdBy: {
                        type: 'object',
                        properties: {
                            _id: { type: 'string' },
                            username: { type: 'string' },
                            email: { type: 'string' },
                        }
                    },
                    taskname: { type: 'string' },
                    tasks: { type: 'array' },
                    deadline: {
                        type: 'string'
                    }
                }
            },
            422: msg

        },
    },
    preHandler: requiredLogin,
    handler: addParticularTask
}




function todoRoutes(fastify, options, done) {

    fastify.post("/todo/add", addtodo);
    fastify.post("/todo/add/task", addparticulartodo);
    fastify.get("/todo/", gettodo);
    fastify.post("/todo/mytodo", getUsertodo);
    fastify.post("/todo/singletask", get_my_particular_todo);

    fastify.put("/todo/update", updatetodo);
    fastify.put("/todo/update/task", update_particular_task_opts);

    fastify.delete("/todo/delete", deletetodo);
    fastify.delete("/todo/delete/task", deletetodotask);


    done()
}

module.exports = todoRoutes;

