import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import { Routes, Route, useNavigate } from "react-router-dom";
import { useReducer, useContext, createContext, useEffect } from 'react';
import { initialstate, reducer } from './reducers/userReducer';

export const userContext = createContext();
 

const Routing = () => {
  const navigate = useNavigate();
  const {dispatch} = useContext(userContext);

  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (user) {
      dispatch({ type: "USER", payload: user })
    }
    else {
      navigate("/")
    }


  }, [])


  return (
    <>
      <ToastContainer />

      <Routes>

        <Route path="/" element={
          <Login />
        } />
        <Route path="/signup" element={
          <Signup />
        } />
        <Route path="/home" element={
          <>
            <Home />
          </>
        } />




      </Routes>
    </>
  )
}
function App() {

  const [state, dispatch] = useReducer(reducer, initialstate)
  return (
    <div className="App">
      <userContext.Provider value={{ state, dispatch }}>
        <Routing />
      </userContext.Provider>
    </div>
  );
}

export default App;
