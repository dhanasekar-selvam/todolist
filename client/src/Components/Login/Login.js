import { React } from 'react'
import './Login.css'
import Axios from "axios"
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Formik } from 'formik';
import * as yup from 'yup';
import {api_url} from '../../Utils/GlobalVars';
const Login = () => {
  const navigate = useNavigate();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const loginImgUrl="https://t3.ftcdn.net/jpg/03/39/70/90/360_F_339709048_ZITR4wrVsOXCKdjHncdtabSNWpIhiaR7.jpg"
  const validate = yup.object({
    email: yup.string().email("Email is Invalid").required("Email is required"),
    password: yup.string().max(6, "Password must be 6 or less than 6 characters").required("Password is required")
  })
  // const loginSubmit = (e) => {

  //   e.preventDefault();

  //   if (!email || !password) {
  //     toast.error("Please fill all fields")
  //   }
  //   else {
  //     console.log(email, password);


  //     const data = {
  //       email: email,
  //       password: password
  //     }
  //     Axios.post("/user/login", data).then((res) => {
  //       console.log(res);
  //       if (res) {
  //         toast.success("Login successfully");
  //         localStorage.setItem("token", res.data.token);
  //         localStorage.setItem("user", JSON.stringify(res.data.user));
  //        navigate("/Home");
  //       }
  //     }).catch((err) => console.log(err));






  //   }
  // }
  return (
    <>

      <div className='container'>

        <div className='centered-container-login '>
          <div className='d-flex justify-content-center ' >
            <div className='flex-fill flex-img'>

              <img src={loginImgUrl} className="login-img" alt="login" />
            </div>
            <div className='flex-fill align-self-center form-login'>
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validate}
                onSubmit={(values) => {
                  const data = {
                    email: values.email,
                    password: values.password
                  }
                  Axios.post(`${api_url}/user/login`, data).then((res) => {
                    console.log(res);
                    if (res) {
                      toast.success("Login successfully");
                      localStorage.setItem("token", res.data.token);
                      localStorage.setItem("user", JSON.stringify(res.data.user));
                      navigate("/Home");
                    }
                  }).catch((err) => 
                  {
                    console.log(err);
                    toast.error(err.response.data.message);
                  })
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
                      <label htmlFor="email" className='text-primary' >Email</label>
                      <input type="email" id='email' className='form-control' name="email" value={values.email} onBlur={handleBlur} onChange={handleChange} />
                      <span className='text-danger'>{errors.email && touched.email && errors.email}</span>
                    </div>
                    <br />
                    <div className='form-group'>
                      <label htmlFor="password" className='text-primary'  >Password</label>
                      <input type="password" id='password' className='form-control' name="password" onBlur={handleBlur} value={values.password} onChange={handleChange} />
                   <span className='text-danger'>   {errors.password && touched.password && errors.password}</span>

                    </div>
                    <button type='submit' className='btn btn-primary mt-4'>Login</button>
                  </form>)}
              </Formik>
              <br />
              <span>Dont have account?</span>
              <Link to="/signup" className="btn btn-primary signup-btn">Sign Up</Link>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Login