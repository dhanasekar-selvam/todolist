import axios, * as others from 'axios';
import React, { useEffect, useState } from 'react'
import { api_url, current_task_name } from '../../Utils/GlobalVars';

const Completedtask = ({ tasks, setUpd, isUpdate, currentTaskName, loading, setLoading }) => {
  const [selectedTask, SetSelectedTask] = useState([])

  if (currentTaskName === null || currentTaskName === '') {
    console.log("empty", current_task_name)
    currentTaskName = current_task_name;
  }

  const undoSubtask = (index, parentIndex, taskname) => {

    // console.log(index, parentIndex);

    //console.log(tasks[parentIndex].tasks[index]._id)
    //console.log(tasks[parentIndex]._id);

    const taskid = tasks[parentIndex].tasks[index]._id;
    const subTaskId = tasks[parentIndex]._id;

    const updData = {
      taskid: taskid,
      id: subTaskId,
      taskname: taskname,
      isDone: false
    }
    // axios.delete(URL, {
    //   headers: {
    //     Authorization: authorizationToken
    //   },
    //   data: {
    //     source: source
    //   }
    // });
    // console.log(updData)

    axios.put(`${api_url}/todo/update/task`,
      updData,
      {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },

      })
      .then(res => {
        setLoading(!loading);
        setUpd(!isUpdate);
        // console.log(res);
      }).catch(err => console.log(err));



  }

  useEffect(() => {
    tasks = tasks.filter(todo => todo.taskname === currentTaskName)
    SetSelectedTask(tasks)
    setLoading(!loading);

  }, [currentTaskName, tasks])
  let count = 0;

  return (
    <>


      {
        tasks.map((task, parentIndex) => {

          return (
            <>

              {task.taskname === currentTaskName ?

                (
                  task.tasks.map((item, index) => {
                    // console.log(item.isDone);
                    return (
                      <>

                        {item?.isDone && (
                          count++,

                          <div className='row '>
                            <h4 className='col-md-8 text-secondary text-capitalize' ><del>{item.subTaskName}</del></h4>
                            <div className='col-md-2'>
                              <a href='' onClick={(e) => {
                                e.preventDefault();
                                undoSubtask(index, parentIndex, item.subTaskName)
                              }} className='btn btn-small btn-primary ' data-toggle="tooltip" data-placement="bottom" title="undo">                     <i className='fa fa-undo'></i>

                              </a>


                            </div>
                          </div>
                        )
                        }
                      </>
                    )
                  }
                  )

                ) : ''

              }

            </>
          )



        })

      }
              {count === 0 || currentTaskName===''? <h4 className='text-secondary'>OOPS!! You have not Completed any task yet</h4> : ''}

    </>
  )
}





export default Completedtask