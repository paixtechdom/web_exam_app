import { useDispatch, useSelector } from "react-redux"
import { useUpdateExamDetails } from "../assets/Hooks/useUpdateExamDetails"
import { useMyAlert } from "../assets/Hooks/useMyAlert"
import { AppDispatch, RootState } from "../assets/store/AppStore"
import { setExams } from "../assets/store/AllExamsSlice"
import { FC, useEffect, useState } from "react"
import { useMyConfirmBox } from "../assets/Hooks/useMyConfirmBox"
import axios from "axios"
import { availableDepartments, DangerButtonCLass, dbLocation, PrimaryButtonCLass, SecondaryButtonCLass } from "../assets/Constants"
import { setConfirmedAction } from "../assets/store/ConfirmBoxSlice"
import Cookie from "js-cookie"
import { Link } from "react-router-dom"
import { EncodeValue, FormatTime } from "../assets/Functions"
import InfoComponent from "./InfoComponent"
import { GetQuestionLength } from "./GetQuestionLength"
import { ExamInfoInterface, setQuestionsLength } from "../assets/store/ExamSlice"



interface AvailableExamBlockInterface {
    exam: ExamInfoInterface
   }
   
export const ExamCard:FC<AvailableExamBlockInterface> = ({exam}) => {
       
    const updateExamDetails = useUpdateExamDetails()
    const triggerAlert = useMyAlert()
    const dispatch = useDispatch<AppDispatch>()


    const [ deleteClicked, setDeleteClicked ] = useState(false)
    const [ isAdmin, setIsAdmin ] = useState(false)
    
    const useConfirmBox = useMyConfirmBox()
    const confirmedAction = useSelector((state: RootState) => state.confirmBox.confirmedAction)  
    const { exams } = useSelector((state: RootState) => state.allexamsslice)  

    useEffect(() => {
        setIsAdmin(Cookie.get("userDetails") == "admin")
    }, [])

    const deleteExam = async () =>{
        await axios.delete(`${dbLocation}/exams.php?examKey=${exam.examKey}&action=delete`)
        .then(function(){
            
            dispatch(setExams(exams.filter(e => e.examKey !== exam.examKey)))
            
            triggerAlert("success", `Exam deleted successfully`)
            
        }).catch(() => {
            triggerAlert("error", `Failed to delete Exam`)
        })
        
    }

    useEffect(() => {
        if(confirmedAction && deleteClicked){        
            deleteExam()    
            dispatch(setConfirmedAction(false))
            setDeleteClicked(false)
        }
    }, [confirmedAction])

    const SetExamInfoGlobally = () => {
        // to update the store and cookie
        updateExamDetails(exam)
        // console.table(exam)

        Cookie.set('examDetails', JSON.stringify(exam), {
            expires: 1,
            sameSite:'strict',
            secure: true
        })
    }
       return(
   
       <div className={`flex flex-col gap-3 rounded-xl shadow-lg p-5 relative
           ${availableDepartments.find(fac => fac.faculty == exam.faculty)?.color} `}>
            <span className={`absolute top-0 right-0 w-8 h-8 rounded-tr-xl rounded-bl-xl ${exam.status == "Active" ?  "bg-green-800 animate-pulse" : "bg-gray-700"}`}
           ></span>
   
           <Link to = {isAdmin ? `/Exam/${EncodeValue(exam?.examTitle || "").toLowerCase()}` : `/Examination/${EncodeValue(exam?.examTitle || "").toLowerCase()}`} 
           className="font-bold text-lg text-gray-700 hover:underline hover:text-blue-900 flex items-center"
           onClick={() => SetExamInfoGlobally()}>  
               {exam.examTitle} 
               <i className="bi bi-pencil-fill text-sm ml-2"></i>
           </Link>
           
           <div className="flex flex-col md:flex-row justify-between gap-3">
               <InfoComponent 
                   title={"Faculty:"}
                   info={exam.faculty}
               />
   
               <div className="w-full lg:w-4/12">
               <InfoComponent 
                   title={"Level:"}
                   info={exam.level}
               />
               </div>
           </div>
   
           <div className="flex flex-col md:flex-row justify-between gap-3">
               
               <InfoComponent 
                   title={"Department:"}
                   info={exam.department}
               />
   
               <div className="w-full lg:w-4/12">
               
   
               <InfoComponent 
                   title={"Questions:"}
                   info={<GetQuestionLength examKey={exam.examKey} />}
               />
               </div>
           </div>

   
            
            {
                isAdmin ? 
                <div className="flex flex-wrap justify-betw een items-center mt-4 gap-3">

                <Link to={`/exams/report/${EncodeValue(exam?.examTitle || "").toLowerCase()}`} className={SecondaryButtonCLass + " center lg:scale-90"}  onClick={() => SetExamInfoGlobally()}>
                    Exam Report
                </Link>
    
                <button className={DangerButtonCLass + " lg:scale-90"}  onClick={() =>{
                        setDeleteClicked(true)
                        useConfirmBox('Confirm to delete this exam' ,exam.examTitle)
                }}>
                    Delete Exam
                </button>

                
                </div>
                :
                <div className="flex flex-col md:flex-row justify-between lg:items-center w-full gap-4 mt-4">

                <div className="w-full md:w-fit">
                    <InfoComponent 
                        title={"Duration:"}
                        info={FormatTime(exam.duration)}
                    />
                </div>
    
                <Link to={`/Examination/${EncodeValue(exam?.examTitle || "").toLowerCase()}`} className={PrimaryButtonCLass + " center w-fit lg:scale-90"}  
                    onClick={() => {
                        SetExamInfoGlobally()
                        dispatch(setQuestionsLength(length))
                    }}>
                    Start Exam
                </Link>
    
              
            </div>

            }
   
       </div>
   )}