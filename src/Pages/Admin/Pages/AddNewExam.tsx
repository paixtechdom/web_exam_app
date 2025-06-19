import axios from "axios"
import { useState } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Cookie from "js-cookie"
import { availableDepartments, dbLocation, ErrorMessageTextClass, PrimaryButtonCLass, TextInputClass, TopLevelHeader } from "../../../assets/Constants"
import { useUpdateExamDetails } from '../../../assets/Hooks/useUpdateExamDetails'
import { useMyAlert } from '../../../assets/Hooks/useMyAlert'
import { EncodeValue } from "../../../assets/Functions"
 


export const AddNewExam = () => {

    const [ selectedFaculty, setSelectedFaculty ] = useState('')
    const Navigate = useNavigate()
    const updateExamDetails = useUpdateExamDetails()
    const triggerAlert = useMyAlert()

    const CookiedUserDetails = Cookie.get("userDetails") 

    useEffect(() =>{
        document.documentElement.scrollTop=0

        Cookie.remove('examDetails', {path:'/admin'})

        if(CookiedUserDetails !== "admin"){
            Navigate("/")
        }

    }, [])

    const schema = yup.object().shape({
        examTitle: yup.string().required('Exam Title is Required'),
        faculty: yup.string().required('Faculty Required'),
        department: yup.string().required('Department is Required'),
        level: yup.string().required('Level is Required'),
        examKey: yup.string(),
        status: yup.string(),
        duration: yup.number()
        })
    
    const { register, handleSubmit, formState: {errors}, setValue } = useForm<ExamFormData>({
        resolver: yupResolver(schema)
    })

    type ExamFormData = yup.InferType<typeof schema>;


    const createExam = async (data:ExamFormData) => {
        let a = new Date().getMinutes()
        let b = new Date().getFullYear()
        let d = new Date().getSeconds()
        let e = new Date().getMilliseconds()
        let newExamKey = ( "exam" + ''+a+''+d+''+b +''+e  )
        setValue('examKey', newExamKey)
        setValue('status', 'Inactive')
        setValue('duration', 0)
        
        // console.log(data)
        await axios.post(`${dbLocation}/exams.php`, data)
        .then((res) =>{
            if(res.data.status == 1){
                triggerAlert("success", "Exam Created Successfully")
                updateExamDetails(data)
                // console.log(res.data.message)
                Navigate(`/exam/${EncodeValue(data.examTitle).toLowerCase()}`)
                // fetchExams()
                Cookie.set('examDetails', JSON.stringify(data), {
                    expires: 1,
                    sameSite:'strict',
                    secure: true
                })
            }else{
                triggerAlert("error", "Error Creating New Exam")
            }
        }).catch(() =>
            triggerAlert("error", "Error Creating New Exam")
        )
    }
    


  return (
    <main className='w-full center pt-[10vh] min-h-[120vh]'>
         <div className="w-11/12 center">

            <form action="" className='flex flex-col bg-gray-100 shadow-xl rounded-xl w-full lg:w-6/12 py-[8vh] px-4 lg:px-8 gap-6'>
                <h2 className={TopLevelHeader}>Add New Exam</h2>

                {/* Name  / Title of Exam */}

                <div className="flex flex-col gap-1">
                    <label className='text-gray-500 font-bold' htmlFor="Exam Title">Exam Title</label>
                    <input className={TextInputClass} type="text" placeholder="Exam Title"  {...register('examTitle')}/>

                    <p className={ErrorMessageTextClass}>{errors.examTitle?.message}</p>

                </div>

                {/* Faculty of Students Taking the Exam */}
                <div className="flex flex-col gap-1">

                    <label className='text-gray-500 font-bold' htmlFor="Faculty">
                        Faculty
                    </label>

                    <select className={TextInputClass} id="" {...register('faculty')}  onChange={(e)=> {
                        setSelectedFaculty(e.target.value)
                    }}>
                        <option value=""  className="valueless">Faculty--</option>
                        {
                            availableDepartments.map((department, key) => (
                                <option key={key} value={department.faculty}>{department.faculty}</option>
                            ))
                        }
                        <option value="All">All</option> 
                    </select>
                    <p className={ErrorMessageTextClass}>{errors.faculty?.message}</p>
                </div>

                {/* Deoartments */}
                <div className="flex flex-col gap-1">

                    <label className='text-gray-500 font-bold' htmlFor="Department">
                        Department
                    </label>

           
                    <select className={TextInputClass}  id="" {...register('department')}>
                    
                        <option value="" className="valueless">{selectedFaculty == '' ? 'Select a Faculty' : 'Department--'}</option>

                        {
                            availableDepartments.find(fac => fac.faculty === selectedFaculty)
                            ?.departments.map((dept, i) => (
                                <option key={i} value={dept}>{dept}</option>
                            ))
                        }
                        {
                            selectedFaculty !== '' &&
                            <option value="All">All</option>
                        }
                    </select>
                    <p className={ErrorMessageTextClass}>{errors.department?.message}</p>
                
                </div>          

                {/* Level */}
                <div className="flex flex-col gap-1 mb-4">

                    <label className='text-gray-500 font-bold' htmlFor="Level">
                        Level
                    </label>

           
                    <select className={TextInputClass} id="" {...register('level')}>
                    
                        <option value="" className="valueless">Level--</option>
                        {
                            availableDepartments.find(fac => fac.faculty === selectedFaculty)
                            ?.levels.map((level, i) => (
                                <option key={i} value={level}>{level}</option>
                            ))
                        }
                        <option value="All" >All</option>

                    </select>
                    <p className={ErrorMessageTextClass}>{errors.level?.message}</p>
                
                </div>               
            
                <button onClick={handleSubmit(createExam)} className={`${PrimaryButtonCLass} w-fit`}> 
                    Create Exam
                </button>

            </form>

            <div className="w-full lg:w-6/12 hidden lg:flex lg:justify-center lg:items-center">
                <img src="/images.png" alt="Picture"  className='w-8/12'/>
            </div>
        </div>
    </main>
  )
}
