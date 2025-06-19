import { useEffect } from "react"
import { AvailableExams } from "./AvailabeExams"
import { useNavigate } from "react-router"
import InfoComponent from "../../Components/InfoComponent"
import { TopLevelHeader } from "../../assets/Constants"
import Cookie from "js-cookie"
import { useDispatch, useSelector } from "react-redux"
import { useUpdateStudentDetails } from "../../assets/Hooks/useUpdateStudentDetails"
import { setShowTopNav } from "../../assets/store/NavigationSlice"
import { RootState } from "../../assets/store/AppStore"



export const Student = () =>{
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const updateStudentDetails = useUpdateStudentDetails()

    const cookiedStudentDetails = Cookie.get("userDetails")
    const studentDetails = useSelector((state: RootState) => state.studentslice)
    const firstName = studentDetails.firstName
    const lastName = studentDetails.lastName
    const department = studentDetails.department
    const matricNumber = studentDetails.matricNumber
    const level = studentDetails.level
    const faculty = studentDetails.faculty


    useEffect(() =>{
        document.documentElement.scrollTop=0

        if(cookiedStudentDetails != undefined){
            if(cookiedStudentDetails == "admin"){
                navigate(`/login`)
            }else{
                updateStudentDetails(JSON.parse(cookiedStudentDetails))
                dispatch(setShowTopNav(true))
            }
        }else{
            navigate(`/Student_login`)   
        }
    }, [])
    return(
        <main className="w-full center flex-col mt-[15vh]">
            <div className="flex w-11/12 flex-col gap-3">

                <h1 className={`${TopLevelHeader}`}><span className="text-2xl">Welcome </span> {firstName}</h1>

                <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 w-full gap-4">
                    <InfoComponent 
                        title={"Name:"}
                        info={firstName + " " + lastName}
                    />

                    <InfoComponent 
                        title={"Faculty:"}
                        info={faculty}
                    />
                    <InfoComponent 
                        title={"Matric Number:"}
                        info={matricNumber}
                    />
                    <InfoComponent 
                        title={"Department:"}
                        info={department}
                    />
                    <div className="flex items-center justify-between gap-4">
                        <InfoComponent 
                            title={"Level:"}
                            info={level}
                        />
                    </div>
                </div>

                <AvailableExams />
            </div>

    

        </main>

        /* shift + alt + a - open comment */
        

    )
}
