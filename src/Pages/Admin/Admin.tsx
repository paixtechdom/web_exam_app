import { useEffect } from "react"
import Dashboard from "./Pages/Dashboard"
import Cookie from "js-cookie"
import { useNavigate } from "react-router-dom"
// import "./Admin.css"

export const Admin = () =>{
    const userName = Cookie.get("userDetails")
    const navigate = useNavigate()

    useEffect(() => {
        document.documentElement.scrollTop=0

        // console.log(userName)
        if(userName == 'admin'){
            
        }else{
            navigate('/')
        }

    }, [])
    // return


        return (
            <main className="admin">
                <Dashboard />
            </main>
        )

 
}