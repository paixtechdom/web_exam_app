import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from "axios"
import { useContext, useEffect } from "react"
import { AppContext } from "../App"
import { useState } from "react"



export const ChangePassword = ({setShowChangePassword}) =>{
    const { setUserName, setStudentMatricNumber, userName, setExamKey, login, setConfirm, logout, setConfirmMessage, setConfirmFunction, userId, dbLocation, userClass } = useContext(AppContext)

    const [user, setUser] = useState([])
    const [showPassword, setShowPassword] = useState('password')

    useEffect(() => {
        getUser()
    }, [])


    const getUser =  () =>{
        if(userName == 'admin'){
            axios.get(`${dbLocation}/index.php/${userId}`).then(function(response){
                setUser(response.data)
            }) 
            
        }else{
            axios.get(`${dbLocation}/studentRegistration.php/${userId}`).then(function(response){
                setUser(response.data)
            }) 

        }
        
    }


    const schema = yup.object().shape({
        confirmOldPassword: yup.
        string()
        .oneOf([(user.password), null], 'Password do not match old password')
        .required('Old Password is a required'),
        password: yup.string().min(6).max(18).required(),
        confirmNewPassword: yup.
        string()
        .oneOf([yup.ref('password'), null], 'Passwords do not match')
        .required('Confirm New Password is a required')
    })
    
    const { register, handleSubmit, setValue, formState: {errors}, reset } = useForm({
        resolver: yupResolver(schema)
    })
    const onUpdate =  (data) =>{
        Update(data.password, userId)
    }
    const Update = async (password, id) =>{
        if(userName == 'admin'){

            await axios.post(`${dbLocation}/${id}/${password}`).then(function(response){    
    
                    reset({
                        confirmNewPassword: '',
                        password: '',
                        confirmOldPassword:''
                    })
                })
            }else{       
                await axios.post(`${dbLocation}/studentRegistration.php/${id}/${password}`).then(function(response){    
        
                        reset({
                            confirmNewPassword: '',
                            password: '',
                            confirmOldPassword:''
                        })
                    })
        }
            
            getUser()
            alert('Password Changed Successfully')
        }
    
    return(
           <div className="changePassword">
             <form className="password" >
                <h3>Change Password</h3>

                <p className="editClose" style={{
                    padding: 0
                }} onClick={() =>{
                    setShowChangePassword(false)
                }}>X</p>

                <input type={showPassword} placeholder="Old Password"  {...register('confirmOldPassword')}/>
                <p className="error">{errors.confirmOldPassword?.message}</p>

                <input type={showPassword} placeholder="New Password"  {...register('password')}/>
                <p className="error">{errors.password?.message}</p>

                <input type={showPassword} placeholder="Confirm New Password"  {...register('confirmNewPassword')}/>
                <p className="error">{errors.confirmNewPassword?.message}</p>
                <div className="passwordReveal" >
                    <input type="checkbox" name="" id="" onClick={() =>{
                        setShowPassword(showPassword == 'text' ? 'password' : 'text') 
                    }}/>
                    <p> Show Passwords </p>
                </div>

                <button onClick={handleSubmit(onUpdate)} > 
                        Save 
                </button>
            </form>
           </div>
   
    )
}