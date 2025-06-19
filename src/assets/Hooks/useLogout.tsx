import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import Cookie from "js-cookie"
import { setShowTopNav } from "../store/NavigationSlice";


export const useLogout = () => {
    // const dispatch = useDispatch();
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const Logout = (goTo: string) => {
        // console.log("log out")
        dispatch(setShowTopNav(false))
        navigate(`/${goTo}`)
        Cookie.remove('userDetails', {path:'/'})
        Cookie.remove('examDetails', {path:'/'})
    
        // set all states

    }
  
  
    return Logout; // Return the function so it can be used in components
  };