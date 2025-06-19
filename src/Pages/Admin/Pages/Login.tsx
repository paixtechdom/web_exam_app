import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import Cookie from "js-cookie"
import { dbLocation, ErrorMessageTextClass, PrimaryButtonCLass, TextInputClass, TopLevelHeader } from "../../../assets/Constants"
import { useMyAlert } from "../../../assets/Hooks/useMyAlert"
import { useLogout } from "../../../assets/Hooks/useLogout"
import { useDispatch } from "react-redux"
import { setShowTopNav } from "../../../assets/store/NavigationSlice"
import { AppDispatch } from "../../../assets/store/AppStore"


export const Login = () =>{
    const Navigate = useNavigate()
    const triggerAlert = useMyAlert()
    const Logout = useLogout()
    const dispatch = useDispatch<AppDispatch>()

    // to store users fetched
 
    // to store error to be displayed if there is error in the login details
    const [ showPassword, setShowPassword ] = useState<string>('password')
    const [ loading, setLoading ] = useState(false)
    // const Navigate = useNavigate()
      
    useEffect(() =>{false
        dispatch(setShowTopNav(false))
        document.documentElement.scrollTop=0
        Logout("login")
    }, [])

    
    // 192.168.43.44

    // to validate the login inputs
    const schema = yup.object().shape({
        userName: yup.string().required('Username is required'),
        Password: yup.string().min(6).max(18).required()
    })
    
    // to handle the details of the form on submit
    const { register, handleSubmit, formState: {errors} } = useForm({
        resolver: yupResolver(schema)
    })

    // LOGIN FUNCTION
    interface loginDataInterface {
        userName: string,
        Password: string
    }

    const onLogin = async (data: loginDataInterface) => {
        // console.log(data)
        setLoading(true)
        await axios.get(`${dbLocation}/index.php/login/${data.userName}/${data.Password}`)
        .then((res) => {
        const user = res.data.user
        if(res.data.status == 1){
            triggerAlert("success", res.data.message)
            Cookie.set('userDetails', user.userName, {
                expires: 1,
                sameSite:'strict',
                secure: true
            })             
            // console.table(Cookie.get("userDetails"))       
            Navigate(`/dashboard`)
            dispatch(setShowTopNav(true))
        }else{
            triggerAlert("error", res.data.message)
            
        }
    })
    .catch((error)=> {
        console.table(error)
        triggerAlert("error", "An error occured, please try again")
    }) 
    .finally(() => {
        setLoading(false)
    })
}



    return (
        <main className="w-full center min-h-screen">
            <div className="w-11/12 center">

                <div className="w-full lg:w-6/12 center flex-col gap-10 bg-gray-100 min-h-[60vh] py-[7vh] px-4 rounded-2xl shadow-xl">
                
                <h1 className={`${TopLevelHeader} w-11/12`}>Admin Login</h1>

                <form className="flex flex-col w-full lg:w-11/12 gap-3">
                    <div className="flex flex-col gap-4">
                        <label className="text-gray-500 font-bold" htmlFor="userName">User Name</label>

                        <input className={TextInputClass} type="text" placeholder="Username"  {...register('userName')} />
                        <p className={ErrorMessageTextClass}>{errors.userName?.message}</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <label className="text-gray-500 font-bold" htmlFor="Password">Password</label>

                        <div className={`${TextInputClass} flex items-center justify-between w-full`}>
                            <input 
                                type={showPassword} 
                                className={"outline-none w-full"}
                                placeholder="**********"  
                                {...register('Password')}
                            />
                            
                            <i className={`bi bi-${showPassword == 'text' ? "eye-slash-fill" : "eye-fill"} text-xl cursor-pointer text-gray-700`} 
                                onClick={() =>{
                                    setShowPassword(showPassword == 'text' ? 'password' : 'text') 
                                }}
                            ></i>
                        </div>
                        <p className={ErrorMessageTextClass}>{errors.Password?.message}</p>
                    </div>                   

                    <button onClick={handleSubmit(onLogin)} className={`${PrimaryButtonCLass} uppercase font-bold w-fit min-w-[200px]`}> 
                        {loading ? "Please Wait..." : "Login"}
                    </button>
                </form>
                
                    <div className="fixed top-0 right-0 w-[300px] hidden lg:block">
                        <img src="./images.jpeg" alt="Pics" />
                    </div>
                </div>


                <button className="fixed top-5 left-5 border border-gray-400 h-[45px] w-[45px] bg-white center rounded-full transition" onClick={() =>{
                    Navigate('/')
                }}>
                    <i className="bi bi-arrow-left text-2xl"></i>
                </button>
        </div>
        </main>
    )
    }