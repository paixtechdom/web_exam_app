import { FC, useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from "axios"
import { dbLocation, ErrorMessageTextClass, PrimaryButtonCLass, TextInputClass } from '../../../../assets/Constants'
import { useMyAlert } from '../../../../assets/Hooks/useMyAlert'
import { useDispatch } from 'react-redux'
import { FetchExamQuestion } from '../../../../assets/store/ExamSlice'
import { AppDispatch } from '../../../../assets/store/AppStore'


interface c {
    examKey: string,
    no: number
}
const AddQuestionForm:FC<c> = ({ examKey, no }) => {
    const triggerAlert = useMyAlert()
    const dispatch = useDispatch<AppDispatch>()
    const [ answer, setAnswer ] = useState('')
    const [ points, setPoints ] = useState(1)
    const [ questionType, setQuestionType ] = useState("multiple-choice")


    const schema = yup.object().shape({
        question: yup.string().required('This field is required'),
        optionA: yup.string().required('This field is required'),
        optionB: yup.string().required('This field is required'),
        optionC: yup.string(),
        optionD: yup.string(),
        examKey:  yup.string(),
        points:  yup.number(),
        questionType:  yup.string(),
        answer:  yup.string()
    })
    
    const { register, handleSubmit, formState: {errors}, reset, setValue } = useForm({
        resolver: yupResolver(schema)
    })

    type QuestionFormData = yup.InferType<typeof schema>;

    const addQuestion = async  (data:QuestionFormData) =>{
        setValue('examKey', examKey)
        setValue("points", points)
        setValue("questionType", questionType)
        if(answer == 'optionA'){
            setValue('answer', "A")
        }
        if(answer == 'optionB'){
            setValue('answer', "B")
        }
        if(answer == 'optionC'){
            setValue('answer', "C")
        }
        if(answer == 'optionD'){
            setValue('answer', "D")
        }
        if(questionType == "multiple-choice"){
            if(data.optionA == "" || data.optionB == "" || data.optionC == "" || data.optionD == ""){
                triggerAlert("error", "Options cannot be empty")
            }else{
                if(data.optionA != data.optionB && data.optionA != data.optionC && data.optionA != data.optionD && data.optionB != data.optionC && data.optionB != data.optionD && data.optionC != data.optionD ){
                    AddAfterVerificaton(data)
                }else{
                    triggerAlert("error", "Options Cannot be the same")
                }
            }
        }
        else if(questionType == "true/false"){
            if(data.optionA == "" || data.optionB == ""){
                triggerAlert("error", "Options cannot be empty")
            }
            else{
                if(data.optionA != data.optionB){
                    AddAfterVerificaton(data)
                }else{
                    triggerAlert("error", "Options Cannot be the same")
                }
            }
        }
    }

    const AddAfterVerificaton = async (data:QuestionFormData) => {
        // To ensure the options are not the same
        if(data.answer != undefined ){
         await axios.post(`${dbLocation}/examquestions.php`, data).then(function() {
            triggerAlert("success", `Question ${no} added successfully`)
            dispatch(FetchExamQuestion(examKey))
            reset({
                question: '',
                optionA: '',
                optionB: '',
                optionC: '',
                optionD: ''
            })
            setPoints(1)
            setQuestionType("multiple-choice")
        })
    
        }else{
            triggerAlert("error", "No answer selected")
        }
    }


    useEffect(() => {
        if(questionType == "true/false"){
            setValue("optionA", "True")
            setValue("optionB", "False")
        }
    }, [questionType])

  return (
    <section className="flex flex-col gap-4 w-11/12 mt-9 bg-gray-100 p-4 py-5 lg:p-9 lg:py-9 rounded-xl">

    
    <div className=" flex flex-col w-full gap-5 lg:gap-9">
        {/* Question Type and Point */}
        <div className="flex justify-between">
            <div className="flex items-center gap-2 lg:gap-3">
                {no}. 
                <select name="" id="" value={questionType} onChange={(e) => {
                    setQuestionType(e.target.value)
                }}
                className='outline-none bg-none bg-transparent min-w-[150px] font-bold text-gray-600 cursor-pointer'>
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true/false">True / False</option>
                </select>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
                    <button className='center hover:scale-90 active:scale-90 bg-white hover:bg-gray-200 active:bg-gray-200 h-8 w-8 text-xl rounded transition-all duration-500 shadow'
                    onClick={()=> {
                        setPoints(prev => prev == 1 ? 1 : prev -1)
                    }}
                    >-</button>
                    <p>{points} Pt</p>
                    <button className='center hover:scale-90 active:scale-90 bg-white hover:bg-gray-200 active:bg-gray-200 h-8 w-8 text-xl rounded transition-all duration-500 shadow'
                    onClick={()=> {
                        setPoints(prev => prev == 5 ? 5 : prev + 1)
                    }}
                    >+</button>
                </div>
        </div>
        
        {/* Question */}
        <div className="flex flex-col gap-2 w-full">
            <div className="center flex-col md:flex-row gap-2 lg:gap-3 w-full">
                <label htmlFor="" className='text-lg font-bold text-gray-700 w-full md:w-fit'>Question</label>
                <input className={TextInputClass + " w-full"} type="text" placeholder="Enter Question"  {...register('question')}/> 

            </div>
            <p className={ErrorMessageTextClass}>{errors.question?.message}</p>

        </div>

        {/* Options */}
        <div className="flex flex-col gap-5 lg:gap-9 justify-between md:grid md:grid-cols-2">

            <div className="flex flex-col gap-2">
                <div className={'flex items-center w-full gap-2 lg:gap-3'}>
                    <p className={`text-l font-bold rounded-full w-10 h-9 shadow center cursor-pointer ${answer == "optionA" ? "bg-green-800 text-white" : "text-gray-600  hover:bg-green-100"}`}
                    onClick={() => setAnswer("optionA")}
                    >A</p>
                    <input className={TextInputClass + ` w-full ${answer =="optionA" ? "bg-green-100" : ""} `} type="text" placeholder="Enter Option A"  {...register('optionA')}
                    readOnly={questionType == "true/false"}
                    />
                </div>
                <p className={ErrorMessageTextClass}>{errors.optionA?.message}</p>
            </div>

            <div className="flex flex-col gap-2">
                <div className={'flex items-center w-full gap-2 lg:gap-3'}>
                    <p className={`text-l font-bold rounded-full w-10 h-9 shadow center cursor-pointer ${answer == "optionB" ? "bg-green-800 text-white" : "text-gray-600 hover:bg-green-100"}`}
                    onClick={() => setAnswer("optionB")}
                    >B</p>
                    <input className={TextInputClass + ` w-full ${answer =="optionB" ? "bg-green-100" : ""} `} type="text" placeholder="Enter Option B"  {...register('optionB')}
                    readOnly={questionType == "true/false"}/>
                </div>
                <p className={ErrorMessageTextClass}>{errors.optionB?.message}</p>
            </div>

            {   questionType !== "true/false" &&
                <>
                    <div className="flex flex-col gap-2">
                        <div className={'flex items-center w-full gap-2 lg:gap-3'}>
                            <p className={`text-l font-bold rounded-full w-10 h-9 shadow center cursor-pointer ${answer == "optionC" ? "bg-green-800 text-white"  : "text-gray-600 hover:bg-green-100"}`}
                            onClick={() => setAnswer("optionC")}
                            >C</p>
                            <input className={TextInputClass + ` w-full ${answer =="optionC" ? "bg-green-100" : ""} `} type="text" placeholder="Enter Option C"  {...register('optionC')}/>
                        </div>
                        <p className={ErrorMessageTextClass}>{errors.optionC?.message}</p>
                    </div>
                
                    <div className="flex flex-col gap-2">
                        <div className={'flex items-center w-full gap-2 lg:gap-3'}>
                            <p className={`text-l font-bold rounded-full w-10 h-9 shadow center cursor-pointer ${answer == "optionD" ? "bg-green-800 text-white"  : "text-gray-600 hover:bg-green-100"}`}
                            onClick={() => setAnswer("optionD")}
                            >D</p>
                            <input className={TextInputClass + ` w-full ${answer =="optionD" ? "bg-green-100" : ""} `} type="text" placeholder="Enter Option D"  {...register('optionD')}/>
                        </div>
                        <p className={ErrorMessageTextClass}>{errors.optionD?.message}</p>
                    </div>
                </> 
            }



        </div>
        
    </div>
        
    <button className={PrimaryButtonCLass + " w-fit"} onClick={handleSubmit(addQuestion)} > 
        Add Question
    </button>

</section>
  )
}

export default AddQuestionForm