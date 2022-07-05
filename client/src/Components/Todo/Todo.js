import axios, * as others from 'axios';
import React, { useEffect, useState } from 'react'
import { api_url, current_task_name } from '../../Utils/GlobalVars';

const Todo = ({ tasks, setUpd, isUpdate, currentTaskName, setEditTask, loading, setLoading, suggestion }) => {

  if (currentTaskName === null || currentTaskName === '') {
    console.log("empty", current_task_name)
    currentTaskName = current_task_name;
  }

  console.log(tasks);
  // const [selectedTask, SetSelectedTask] = useState([])
  const deleteSubtask = (index, parentIndex) => {

    // console.log(index, parentIndex);

    //console.log(tasks[parentIndex].tasks[index]._id)
    //console.log(tasks[parentIndex]._id);

    const taskid = tasks[parentIndex].tasks[index]._id;
    const subTaskId = tasks[parentIndex]._id;

    const deleteData = {
      taskid: taskid,
      id: subTaskId
    }


    axios.delete(`${api_url}/todo/delete/task`, {
      data: deleteData,
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },

    })
      .then(res => {
        setLoading(!loading);

        setUpd(!isUpdate);
        console.log(res);
      }).catch(err => console.log(err));



  }

  const completeSubtask = (index, parentIndex, taskname) => {


    console.log(index, parentIndex);

    //console.log(tasks[parentIndex].tasks[index]._id)
    //console.log(tasks[parentIndex]._id);

    const taskid = tasks[parentIndex].tasks[index]._id;
    const subTaskId = tasks[parentIndex]._id;


    const updData = {
      taskid: taskid,
      id: subTaskId,
      taskname: taskname,
      isDone: true
    }

    console.log(updData)

    axios.put(`${api_url}/todo/update/task`,
      updData,
      {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },

      })
      .then(res => {
        setLoading(!loading);

        setUpd(!isUpdate);
        console.log(res);
      }).catch(err => console.log(err));


  }

  const addTask = (id) => {
    console.log(id);
    console.log(tasks);
    setEditTask(tasks[id]);
  }
  const editTask = (index, parentIndex) => {
    setLoading(!loading);

    console.log(tasks[parentIndex]);
    setEditTask(tasks[parentIndex]);

  }


  // useEffect(() => {
  //   const selectedTask = tasks.filter(todo => todo.taskname === currentTaskName)
  //   console.log(selectedTask);
  //   SetSelectedTask(selectedTask);

  // }, [currentTaskName, tasks])

  console.log(tasks);
  let count = 0;
  let newTaskId = -1;
  return (

    <>
      <div className='row todo-header'>
        <div className='col-md-8'>
          <h3 className='text-success'>TODO</h3>
        </div>
        {(currentTaskName?.length > 0 || (suggestion?  Object.keys(suggestion).length > 0: "")) ? (<div className='item'>   <button className='btn btn-small float-right btn-primary add-task-btn ' onClick={() => addTask(newTaskId)}>Add Task</button>
        </div>) : ''
        }

      </div>

      {

        tasks?.map((task, parentIndex) => {
          return (

            <>

              {task.taskname === currentTaskName ?
                (
                  newTaskId = parentIndex,

                  task.tasks.map((item, index) => {

                    return (

                      <>

                        {item.isDone === false && (
                          count++,
                          <div className='row  mt-1' >
                            <h4 className='col-md-8 text-secondary text-capitalize' key={index} >{item.subTaskName}</h4>
                            <div className='col-md-4'>
                              <a href='' className='btn btn-small btn-primary ' data-toggle="tooltip" data-placement="bottom" title="edit"
                                onClick={(e) => {
                                  e.preventDefault();
                                  editTask(index, parentIndex)
                                }}>
                                <i className='far fa-edit'></i>

                              </a>
                              <a href='' onClick={(e) => {
                                e.preventDefault();
                                deleteSubtask(index, parentIndex)
                              }} className='btn btn-small btn-danger pl-2' data-toggle="tooltip" data-placement="bottom" title="delete"><span aria-hidden="true">	&times;</span></a>

                              <a href='' onClick={(e) => {
                                e.preventDefault();
                                completeSubtask(index, parentIndex, item.subTaskName)
                              }} className='btn btn-small btn-success ' data-toggle="tooltip" data-placement="bottom" title="complete"><span aria-hidden="true">	&#10003;</span></a>
                            </div>
                          </div>
                        )
                        }
                      </>
                    )
                  })
                ) : ''
              }

            </>

          )



        }

        )
      }
      {count === 0 && <h4 className='text-primary'>Cheers Nothing to do...</h4>}

    </>
  )
}





export default Todo