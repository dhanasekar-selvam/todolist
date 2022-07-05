import React, { useContext, useEffect, useState } from 'react'
import "./Home.css";
import { Formik, FieldArray, ErrorMessage, Field } from 'formik';
import * as yup from 'yup';
import Axios from 'axios';
import { toast } from 'react-toastify';
import Todo from '../Todo/Todo';
import BeatLoader from "react-spinners/BeatLoader";
import Completedtask from '../CompletedTask/Completedtask';
import { userContext } from '../../App';
import { api_url, current_task_name } from '../../Utils/GlobalVars';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  var imgUrl = "https://www.pngall.com/wp-content/uploads/8/Task-List.png ";
  var backImgUrl = "http://wallpapers.net/web/wallpapers/spot-light-background-hd-wallpaper/thumbnail/lg.jpg"


  // console.log(current_task_name)
  const { state } = useContext(userContext);
  //console.log(state);
  const [todo, setTodo] = useState([]);
  const [editTask, setEditTask] = useState([])
  const [upd, setUpd] = useState(false);
  const [text, setText] = useState('');
  const [suggestion, SetSuggestion] = useState([]);
  const [loading, setLoading] = useState(true);
  //console.log(editTask);
  const navigate = useNavigate();
  useEffect(() => {

    setTimeout(() => {
      setLoading(false);
    }, 1000)

  }, [loading, text])




  const onChangeHandler = (text) => {
    // console.log(text)
    let matches = [];
    if (text.length > 0) {
      matches = todo.filter(task => {
        const regex = new RegExp(`${text}`, 'gi');
        return task.taskname.match(regex)
      })
    }
    //console.log('matches', matches)
    SetSuggestion(matches)
    setText(text)
  }



  const onSuggestHandler = (value) => {
    //console.log("came")
    setText(value);
    localStorage.setItem('currentTaskName', value);

    setLoading(true);
    SetSuggestion([])
  }
  // const [taskValues, setTaskvalue] = useState([{ subTaskName: "", isDone: false }]);


  // let handleChangeTask = (i, e) => {

  //   let newTaskValues = [...taskValues];

  //   newTaskValues[i][e.target.name] = e.target.checked ? e.target.checked : e.target.value;
  //   setTaskvalue(newTaskValues);
  // }


  // const addTaskField = () => {
  //   setTaskvalue([...taskValues, { subTaskName: "", isDone: false }])
  // }

  // csonst removeTaskFields = (i) => {
  //   let newTaskValues = [...taskValues];
  //   newTaskValues.splice(i, 1);
  //   setTaskvalue(newTaskValues)
  // }

  // let handleSubmit = (event) => {
  //   event.preventDefault();
  //   alert(JSON.stringify(taskValues));
  // }

  const deleteTask = (taskname) => {
    const taskid = todo?.filter(todo => todo.taskname === taskname)
    const data = {
      id: taskid
    }
    Axios.delete(`${api_url}/todo/delete`,
      {
        data: data
        ,

        headers: { Authorization: "Bearer " + localStorage.getItem("token") },

      })
      .then(res => {
        localStorage.removeItem("currentTaskName")
        setText(
          '')
        setLoading(!loading);

        setUpd(!upd);
        
        console.log(res);
      }).catch(err => console.log(err));

  }

  const logOutHandler = () => {
    localStorage.clear();
    setLoading(!loading);
    setTimeout(() => {
      navigate("/");
      toast.success("Logout Successfully")
    }, 1000)
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000)
    console.log("runs");
    if (state) {
      Axios.post(`${api_url}/todo/mytodo`, { _id: state?._id }, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } })
        .then(res => {
          console.log(res.data);
          if (current_task_name !== '')
            setTodo(res.data);
          //console.log(todo[0]._id)
          //setPosts(res.data.Posts);                                                                                                                                                                                                                                                                
          //console.log(res);
        })
        .catch(err => console.log(err));
    }
  }, [state, upd])

  const validate = yup.object({
    taskname: yup.string().required("taskname is required"),
    tasks: yup.array()
      .of(yup.object().shape
        ({
          subTaskName: yup.string().required("this field is required"),
          isDone: yup.boolean()
        })),
    deadline: yup.date().required("Deadline is required")
  })

  const initialValues =

  {
    taskname: '',
    tasks: [{
      subTaskName: '',
      isDone: false
    }],
    deadline: ''

  }
  //console.log(Object.keys(editTask).length);
  // const savedValues =
  // {
  //   taskname: editTask?.taskname,
  //   tasks: [editTask.tasks], deadline: editTask.deadline
  // }

  return (

    // (loading ?
    //   <div className='d-flex justify-content-center loader '>
    //       <BeatLoader color={"#4A90E2"}  loading={loading} size={40} />
    //   </div>
    //   :
    <>
      {/* <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#deletedialog">
        Launch demo modal
      </button> */}


      {/* <img src={backImgUrl} className="img-fluid background-img" alt="bg" /> */}

      <div className='parent-container'>


        <div className='loader'>
          <BeatLoader color={"#4A90E2"} loading={loading} size={40} />
        </div>











        <img src={backImgUrl} className="img-fluid background-img" alt="bg" />


        <div className='home-container '>

          <div className='search-log'>
            {/* <div className='search-log__item'> */}
            {/* <div> */}
            <input type="text" className="form-control search " placeholder="Search tasks.." onChange={(e) => {
              onChangeHandler(e.target.value)
            }}
              value={text}

              onBlur={() => {
                setTimeout(() => {
                  SetSuggestion([]);

                }, 300)
              }}
            />
            {/* </div> */}

            {/* </div> */}
            {/* <div className='item'> */}
            <button className='btn btn-small btn-secondary logout-btn ' onClick={logOutHandler}>Log Out</button>
            {/* </div> */}
          </div>

          {suggestion && suggestion.map((suggestion, i) =>
            <div className=' shadow p-2 text-white suggestion' key={i} onClick={() => onSuggestHandler(suggestion.taskname)}>
              {suggestion.taskname}
            </div>

          )}


          <div className='row align-items-center mt-4  task-container'>

            <div className='col-md-4 col-lg-6 col-xl-12 border task-add-form p-3 shadow  mb-5  rounded '>
              <Formik
                initialValues={Object.keys(editTask).length > 0 ? (editTask.tasks.length > 0 ? (editTask) : ({ ...editTask, tasks: [{ subTaskName: '', isDone: false }] } )) : initialValues || initialValues}
                validationSchema={validate}
                onSubmit={(values, { resetForm }) => {
                  //console.log(values);
                  var data = {
                    taskname: values.taskname,
                    tasks: values.tasks,
                    deadline: values.deadline
                  }
                  if (Object.keys(editTask).length > 0) {
                    //console.log("updvalues", values)
                    data = { ...data, id: editTask._id }
                    //console.log(data);
                    Axios.put(`${api_url}/todo/update`, data, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }).then((res) => {
                      if (res) {
                        toast.success("updated success");
                        setUpd(!upd)
                        resetForm({ values: initialValues });
                        setEditTask([]);

                        // console.log(res);
                      }
                    }).catch((err) => {
                      // console.log(err.response.data.message)
                      toast.error(err.response.data.message)
                    })
                  }
                  else {
                    Axios.post(`${api_url}/todo/add`, data, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }).then((res) => {
                      if (res) {
                        toast.success("added success");
                        setUpd(!upd)
                        resetForm({ values: initialValues });
                        setEditTask([]);

                        //console.log(res);
                      }

                    }).catch((err) => {
                      // console.log(err.response.data.message)
                      toast.error(err.response.data.message)
                    }


                    );
                  }


                }}
                enableReinitialize

              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <div className='img-responsive'>
                      <img src={imgUrl} className='image img-fluid' alt='taskimg' />
                    </div>
                    <div className='form-group mb-3' >
                      <label htmlFor="taskname" className='text-dark'  >Task Name</label>
                      <Field className='form-control' name="taskname" value={values.taskname} onBlur={handleBlur} onChange={handleChange} />

                      {/* <input type="text" id='taskname' className='form-control' name="taskname"  onBlur={handleBlur} onChange={handleChange} /> */}
                      <span className='text-danger'>{errors.taskname && touched.taskname && errors.taskname}</span>
                    </div>
                    <label htmlFor="subTask " className='text-dark' >Tasks</label>
                    <FieldArray
                      name="tasks"
                      render={arrayHelpers => {

                        const tasks = values.tasks;
                        return (
                          <div>
                            {tasks && tasks.length > 0

                              ?
                              tasks.map((element, index) => (
                                <div className='form-group mt-2' key={index}>
                                  <div className='d-flex'>

                                    <div className='item '>
                                      <Field className='form-control ' onBlur={handleBlur} onChange={handleChange} value={tasks[index].subTaskName} name={`tasks.${index}.subTaskName`} />
                                      {/* <input type="text" id='subTask' className='form-control ' onBlur={handleBlur} onChange={handleChange} value={tasks[index].subTaskName} name={`tasks.${index}.subTaskName`}
                                    /> */}
                                      <div className='text-danger'>
                                        <ErrorMessage name={`tasks.${index}.subTaskName`} />
                                      </div>

                                    </div>
                                    <div className='item p-2 align-self-center'>

                                      <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" id="inlineCheckbox1" onBlur={handleBlur} checked={tasks[index].isDone} name={`tasks.${index}.isDone`} onChange={handleChange} />
                                        <label className="form-check-label" htmlFor="inlineCheckbox1">Done</label>
                                      </div>
                                    </div>
                                    <div className='item p-2 align-self-center'>
                                      {

                                        index ?
                                          <button type="button" className="button btn-danger  " value={element.subTaskName || ""} onClick={() => arrayHelpers.remove(index)}>  <span aria-hidden="true">&times;</span>
                                          </button>
                                          : null
                                      }
                                    </div>
                                  </div>
                                </div>
                              )) : null}


                            <div className='form-group mt-3'>
                              <label htmlFor='deadline'>Deadline</label>
                              <Field type="date" className="form-control" name="deadline" onBlur={handleBlur} onChange={handleChange} value={values.deadline} />

                              {/* <input type="date" className="form-control" id="deadline" name="deadline" onBlur={handleBlur} onChange={handleChange} value={values.deadline} /> */}
                              <span className='text-danger'>{errors.deadline && touched.deadline && errors.deadline}</span>

                            </div>
                            <button className="btn btn-primary mt-4" type="button" onClick={() =>
                              arrayHelpers.push({
                                subTaskName: "",
                                isDone: false
                              })
                            }>Add</button>
                            {Object.keys(editTask).length > 0 ? (
                              <>
                                <button className="btn btn-success submit mt-4 mx-2" type="submit">Update</button>
                                <button className="btn btn-danger submit mt-4 mx-2" onClick={() => {
                                  setEditTask([])
                                }}>Cancel</button>
                              </>

                            ) :
                              <button className="btn btn-success submit mt-4 mx-2" type="submit">Submit</button>}
                          </div>
                        );
                      }} />
                  </form>
                )
                }
              </Formik>
            </div>
            <div className='current_task_namecol-md-8 col-lg-12  col-xl-8  task-view  mb-5  ' >

              {current_task_name?.length > 0 && (<div className='row taskname-header '>
                <div className='item'>
                  <h4 className=' title-text text-capitalize  mt-3 col-md-10 col-sm-2'>{text !== '' ? text : current_task_name}</h4>
                </div>
                <div className='item align-self-center'>
                  <button className='btn btn-sm btn-primary' data-toggle="modal" data-target="#deletedialog">Delete Task</button>
                </div>
              </div>)}

              <div className='d-flex task'>

                <div className='p-2 item task-todo shadow mt-3' >


                  {/* <button className='btn btn-small float-right btn-primary col-md-4' onClick={()=>addTask(addIndex)}>Add Task</button> */}
                  <Todo tasks={todo} currentTaskName={text} suggestion={suggestion} setUpd={setUpd} isUpdate={upd} name="works" setEditTask={setEditTask} loading={loading} setLoading={setLoading} />
                </div>
                <div className='p-2 item task-done shadow mt-3'>
                  <h3 className='text-success'>COMPLETED</h3>

                  <Completedtask tasks={todo} currentTaskName={text} setUpd={setUpd} isUpdate={upd} loading={loading} setLoading={setLoading} />              </div>
              </div>
            </div>


          </div>
        </div>
      </div>
      <div class="modal fade" id="deletedialog" tabindex="-1" role="dialog" aria-labelledby="deletedialogTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalCenterTitle">Delete Confirmation</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              Are You Sure to delete the task  {text !== '' ? text : current_task_name}?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
              <button type="button" class="btn btn-danger" data-dismiss="modal" onClick={() => { deleteTask(text !== '' ? text : current_task_name) }}>Yes</button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
  //)
}

export default Home