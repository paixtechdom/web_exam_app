import axios from "axios"
import { useEffect } from "react"
import { dbLocation } from "../../assets/Constants"
import Cookie from "js-cookie"
import { ExamCard } from "../../Components/ExamCard"
import { useUpdateStudentDetails } from "../../assets/Hooks/useUpdateStudentDetails"
import { studentInfoInterface } from "../../assets/Interfaces"
import { EncodeValue } from "../../assets/Functions"
import { AppDispatch, RootState } from "../../assets/store/AppStore"
import { useDispatch, useSelector } from "react-redux"
import { setExams } from "../../assets/store/AllExamsSlice"


export const AvailableExams = () => {
    const updateStudentDetails = useUpdateStudentDetails()
    const dispatch = useDispatch<AppDispatch>()
    const { exams } = useSelector((state:RootState) => state.allexamsslice)
    const cookiedDetails  = Cookie.get("userDetails")

    useEffect(() =>{
        if(cookiedDetails != undefined){
            const cookiedStudentDetails = JSON.parse(cookiedDetails)
            updateStudentDetails(cookiedStudentDetails)      
            fetchExams(cookiedStudentDetails)
        }
    }, [])
    
    

    const fetchExams = (studentDetails : studentInfoInterface) =>{        
        axios.get(`${dbLocation}/exams.php/availableExams/${studentDetails.level}/${EncodeValue(studentDetails.department)}/${EncodeValue(studentDetails.faculty)}/${studentDetails.id}`)
        .then(function(res){
            const exams = res.data
            dispatch(setExams(exams))
        }) 
    }



    return(
        <section className="my-[10vh] flex flex-col w-full">
            <h3 className="font-bold text-xl text-gray-700">({exams.length}) Available Exams</h3>
            {
                
                exams.length == 0 ?
                <div className="h-[70vh] center flex-col gap-2">
                    <i className="bi bi-file-text text-5xl"></i>
                    <p>No available exam</p>
                </div>
                : 
                    <section className="w-full mt-[7vh] gap-5 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {exams?.map((exam) => (
                        <ExamCard
                        exam={exam}
                        key={exam.id}
                        />
                    ))
                  }
                 </section>
            }
        </section>
    )
    
    
}   
