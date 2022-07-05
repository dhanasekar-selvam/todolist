import React from 'react'
import Axios from "axios";
import "./Signup.css"
import { useNavigate } from 'react-router-dom';
import { Formik  } from 'formik';
import * as yup from "yup";
import { toast } from 'react-toastify';
import {api_url} from '../../Utils/GlobalVars';
const Signup = () => {
  const navigate=useNavigate();
  const validate=yup.object({
    username:yup.string().max(15,"Length must be less than 15").required("This Field is Required"),
    email:yup.string().email("Email is invalid").required("Email is required"),
    password:yup.string().max(6,"Password length Should be max 6 letters").min(4,"Password length Should be min 4 letters").required("Password is requried"),
    cpassword:yup.string().max(6,"Confirm Password length Should be  max 6 letters").min(4,"Confirm Password length Should be min 4 letters")
    .oneOf([yup.ref('password'),null],"Password not matched to confirm password")
    .required("Confirm password is required")
  })


  // const signupSubmit = (e) => {

  //   e.preventDefault();

  //   if (!username || !email || !password || !cpassword) {
  //     alert("empty values");
  //   }
  //   else {
  //     console.log(username, email, password);

  //     if (password !== cpassword) {
  //       alert("password wrong");
  //     }
  //     else {
  //       const data = {
  //         username: username,
  //         email: email,
  //         password: password
  //       }
  //       Axios.post("/users/add", data).then((res) => {
  //         console.log(res);
  //         if(res)
  //             navigate("/login");
  //       }).catch((err) => console.log(err));
  //     }





  //   }
  // }

  return (
    <>
      <div className='container'>

        <div className='centered-container shadow p-3 mb-5 bg-white rounded'>
          <div className='d-flex justify-content-center ' >
            <div className='flex-fill'>
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/user-account-sign-up-4489360-3723267.png" alt="login" />
            </div>
            <div className='flex-fill align-self-center'>
              <Formik
              
               initialValues={{
                 username:'',
                 email:'',
                 password:'',
                 cpassword:''
               }}
               validationSchema={validate}
               onSubmit={(values)=>{
                const data = {
                  username: values.username,
                  email: values.email,
                  password: values.password
                }
                Axios.post(`${api_url}/users/add`, data).then((res) => {
                  console.log(res);
                  if(res)
                  {
                    toast.success("Saved Successfully");
                      navigate("/");
                  }
                }).catch((err) => console.log(err));
              

               }}
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
                <div className='form-group'>
                  <label htmlFor="username" className='text-primary' >Username</label>
                  <input type="text" id='username' className='form-control' name="username" value={values.username} onBlur={handleBlur} onChange={handleChange} />
                  <span className='text-danger'>{errors.username && touched.username && errors.username}</span>

                </div>
                <br />
                <div className='form-group'>
                  <label htmlFor="email" className='text-primary' >Email</label>
                  <input type="email" id='email' className='form-control' name="email" value={values.email} onBlur={handleBlur} onChange={handleChange} />
                  <span className='text-danger'>{errors.email && touched.email && errors.email}</span>

                </div>
                <br />
                <div className='form-group'>
                  <label htmlFor="password" className='text-primary'  >Password</label>
                  <input type="password" id='password' className='form-control' name="password" onBlur={handleBlur} onChange={handleChange} />
                  <span className='text-danger'>{errors.password && touched.password && errors.password}</span>

                </div>
                <br />
                <div className='form-group'>
                  <label htmlFor="cpassword" className='text-primary'  >Confirm Password</label>
                  <input type="password" id='cpassword' className='form-control' name="cpassword" onBlur={handleBlur} onChange={handleChange} />
                  <span className='text-danger'>{errors.cpassword && touched.cpassword && errors.cpassword}</span>

                </div>
                <button type='submit' className='btn btn-primary mt-4'>Signup</button>
              </form>
                )}
              </Formik>
              <br />
              <span>Have an account?</span><a href='/' className='btn btn-primary login-btn ' > Login</a>
            </div>

          </div>
        </div>
      </div>
    </>
  )

}

export default Signup