import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import Cookie from "js-cookie"
import { dbLocation, ErrorMessageTextClass, PrimaryButtonCLass, TextInputClass, TopLevelHeader } from "../../assets/Constants"
import { useMyAlert } from "../../assets/Hooks/useMyAlert"
import { useUpdateStudentDetails } from "../../assets/Hooks/useUpdateStudentDetails"
import { useLogout } from "../../assets/Hooks/useLogout"
import { AppDispatch } from "../../assets/store/AppStore"
import { useDispatch } from "react-redux"
import { setShowTopNav } from "../../assets/store/NavigationSlice"



export const StudentLogin = () => {

    const [ showPassword, setShowPassword ] = useState('password')
    const [ loading, setLoading ] = useState(false)
    const Logout = useLogout()
    const Navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const triggerAlert = useMyAlert()
    const updateStudentDetails = useUpdateStudentDetails()

    useEffect(() => {
        document.documentElement.scrollTop = 0
        Logout("Student_login")
    }, [])
    
    
    // to validate the login inputs
    const schema = yup.object().shape({
        matricNumber: yup.string().required('Matric Number is required'),
        Password: yup.string().min(6).max(18).required()
    })
     
    
    // to handle the details of the form on submit
    const { register, handleSubmit, formState: {errors} } = useForm({
        resolver: yupResolver(schema)
    })


    interface loginDataInterface {
        matricNumber: string,
        Password: string
    }



    const onLogin = async (data: loginDataInterface) => {
        setLoading(true)
        await axios.get(`${dbLocation}/studentRegistration.php/login/${data.matricNumber}/${data.Password}`)
            .then((res) => {
            const user = res.data.user
            if(res.data.status == 1){
                triggerAlert("success", res.data.message)
                Cookie.set('userDetails', JSON.stringify(user), {
                    expires: 1,
                    sameSite:'strict',
                    secure: true
                })             

                updateStudentDetails(user)     
                dispatch(setShowTopNav(true))
                Navigate(`/student/${user.firstName}-${user.lastName}`)
            }else{
                triggerAlert("error", res.data.message)
                
            }
        })
        .catch(()=> {
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
                    <h1 className={`${TopLevelHeader} w-11/12`}>Student Login</h1>

                    <form className="flex flex-col w-11/12 gap-3">
                        <div className="flex flex-col gap-4">
                            <label className="text-gray-500 font-bold" htmlFor="matricNumber">Matric Number</label>

                            <input className={TextInputClass} type="text" placeholder="Input your Matric Number"  {...register('matricNumber')} />
                            <p className={ErrorMessageTextClass}>{errors.matricNumber?.message}</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <label className="text-gray-500 font-bold" htmlFor="password">Password</label>

                            <div className={`${TextInputClass} flex items-center justify-between w-full`}>
                                <input 
                                    type={showPassword} 
                                    {...register('Password')}
                                    className={"outline-none w-full"}
                                    placeholder="Password"  
                                />
                                
                                <i className={`bi bi-${showPassword == 'text' ? "eye-slash-fill" : "eye-fill"} text-xl cursor-pointer text-gray-700`} 
                                    onClick={() =>{   
                                        setShowPassword(showPassword == 'text' ? 'password' : 'text') 
                                    }}
                                ></i>
                                {/* <input type="checkbox" name="" id="" 
                                /> */}
                            </div>
                            <p className={ErrorMessageTextClass}>{errors.Password?.message}</p>
                        </div>

                        <button onClick={handleSubmit(onLogin)} className={`${PrimaryButtonCLass} uppercase font-bold w-fit min-w-[200px]`}> 
                            {loading ? "Please Wait..." : "Login"}
                            
                        </button>
                    </form>

                    <div className="fixed top-0 right-0 w-[300px] hidden lg:block">
                        <img src="./istockphoto-1384437843-612x612.jpg" alt="Piss" />
                    </div>

                </div>
                <button className="fixed top-5 left-5 border border-gray-400 h-[45px] w-[45px] bg-white center rounded-full transition" onClick={() =>{
                    Navigate('/')
                }}
                >
                    <i className="bi bi-arrow-left text-2xl"></i>
                </button>
            </div>
        </main>
    )
}