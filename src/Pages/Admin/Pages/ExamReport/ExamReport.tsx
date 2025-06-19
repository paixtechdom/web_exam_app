import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Cookie from "js-cookie"
import { useNavigate } from "react-router-dom"
import { dbLocation, TopLevelHeader } from "../../../../assets/Constants"
import InfoComponent from "../../../../Components/InfoComponent"
import axios from "axios"
import { useMyAlert } from "../../../../assets/Hooks/useMyAlert"
import { useUpdateExamDetails } from "../../../../assets/Hooks/useUpdateExamDetails"
import { FormatTime } from "../../../../assets/Functions"
import { ResultsTable } from "./ResultsTable"
import { RootState } from "../../../../assets/store/AppStore"
import { AdminResultTableInterface } from "../../../../assets/Interfaces"

const Students = [
    {score: 65},
    {score: 57},
    {score: 49},
    {score: 70},
    {score: 60},
    {score: 42},
    {score: 90},
    {score: 39},
    {score: 89},
    {score: 90},
]

export interface performanceInterface{
    passed: number,
    average: number,
    failed: number
}
export type PerformanceType = keyof performanceInterface;

export const ExamReport = () => {
    const navigate = useNavigate()
    const triggerAlert = useMyAlert()
    const updateExamDetails = useUpdateExamDetails()
    const examstate = useSelector((state:RootState) => state.examslice)  

    const examKey = examstate.examKey
    const examTitle = examstate.examTitle
    const duration = examstate.duration
    const level = examstate.level      
    const faculty = examstate.faculty      
    const department = examstate.department   
    const totalScore = examstate.totalScore   

    
    const cookiedExamDetails = Cookie.get('examDetails')
    
    const [ results, setResults ] = useState<AdminResultTableInterface[]>([])
    const [ performance, setPerformance ] = useState({
        passed: 0,
        average: 0,
        failed: 0
    })



    const UpdatePerformanceState = (type: PerformanceType) => {
        setPerformance({
            ...performance,
            [type]: performance[type] += 1
        })
    }

    
    


    const FetchExam = async (key:string) => {
        await axios.get(`${dbLocation}/exams.php/${key}/fetch`)
        .then((res) => {
            const exam = res.data[0]

            if(exam == undefined){
                // navigate("/exams/all-exams") 
                triggerAlert("error", "Error Fetching Exam undefined")
                return
            }
            
            if((window.document.URL).split("/")[5].toLowerCase() !== exam.examTitle.toLowerCase().replaceAll(" ", "-")){
                triggerAlert("error", "Error Fetching Exam")
                // navigate("/page-not-found")
                return
            }

            updateExamDetails(exam)
            
        })
        .catch(() => {
            triggerAlert("error", "Error Fetching Exam catch")
            // navigate("/exams/all-exams")            
        })
    }
    const fetchResults = (examKey: string) =>{


        axios.get(`${dbLocation}/examResults.php/${examKey}`).then(function(response){
            // console.table(response.data)
            setResults(response.data)
            let ntotalScore= cookiedExamDetails != undefined ? (JSON.parse(cookiedExamDetails)).totalScore : totalScore
    
            const minScore = ntotalScore/2 - ntotalScore/20
            const maxScore = ntotalScore/2 + ntotalScore/20
            
            // console.log(minScore, totalScore, maxScore)

            response.data.forEach( (s : AdminResultTableInterface) => 
                s.score >= maxScore ? UpdatePerformanceState("passed") : 
                s.score <= minScore ? UpdatePerformanceState("failed") : 
                s.score > minScore && s.score < maxScore ? UpdatePerformanceState("average") : ""
            ) 
        }) 
    }
    
    
    
    const CookiedUserDetails = Cookie.get("userDetails") 

    
    useEffect(() =>{
        document.documentElement.scrollTop=0

        if(CookiedUserDetails == "admin"){

            if(cookiedExamDetails != undefined){
                const cookiedExamDetailsObject = JSON.parse(cookiedExamDetails)            
                updateExamDetails(cookiedExamDetailsObject)
                FetchExam(cookiedExamDetailsObject.examKey || examKey)
                fetchResults(cookiedExamDetailsObject.examKey || examKey)
            }
            else{
                navigate("/exams/all-exams")            
            }
        }else{
            navigate("/")
        }
    }, [])


    // create a new array from what was fetched


    return(
        <main className="w-full center pt-[15vh]">
            <div className="w-11/12 center flex-col gap-12 mb-[10vh] lg:mb-[20vh]">

                <div className="flex flex-col w-full gap-5">
                    <h2 className={`${TopLevelHeader} w-full`}>Exam Report</h2>
                

                    <h2 className={`font-bold w-full text-2xl`}> <span className="text-base font-light">Title:</span> {examTitle}</h2>

                    <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-2 w-full gap-4">
                        <InfoComponent 
                            title={"Faculty:"}
                            info={faculty}
                        />
                        <InfoComponent 
                            title={"Department:"}
                            info={department}
                        />
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                            <InfoComponent 
                                title={"Level:"}
                                info={level}
                            />
                            <InfoComponent 
                                title={"Duration:"}
                                info={FormatTime(duration)}
                            />
                        </div>
                        <InfoComponent 
                            title={"Total Score:"}
                            info={totalScore}
                        />
                    </div>
                </div>


                <PerformanceChart 
                    performance={performance}
                />
                <ResultsTable 
                    data={results || []}
                    currentPage={1}
                />
            </div>
        </main>
    )
}

interface PerformanceChartInterface{
    performance: performanceInterface
}

const PerformanceChart = ({ performance }:PerformanceChartInterface) => {

 

    return(
        <section className="flex w-full flex-col gap-3">

            <div className="flex w-full bg-gray-100 relative h-[2vh] rounded-full xl shadow-md overflow-hidden">


                <PerformanceInfo 
                    performance={performance.passed}
                    color={"green-500"}
                />
        
                <PerformanceInfo 
                    performance={performance.average}
                    color={"gray-500"}
                />
        
                <PerformanceInfo 
                    performance={performance.failed}
                    color={"red-600"}
                />

            </div>

            <div className="flex items-center text-sm gap-5">
                <div className="center gap-1">
                    <p className="h-3 w-3 bg-green-500 rounded-full"></p>
                    Passed: {performance.passed}
                </div>
                <div className="center gap-1">
                    <p className="h-3 w-3 bg-gray-500 rounded-full"></p>
                    Average: {performance.average}
                </div>
                <div className="center gap-1">
                    <p className="h-3 w-3 bg-red-600 rounded-full"></p>
                    Failed: {performance.failed}
                </div>
            </div>
        </section>
    )

}
interface b {
    performance: number,
    color: string
}

const PerformanceInfo = ({performance, color} : b) =>{
    return(
        <div className={`bg-${color} h-full relative`} style={{
            width: ((performance / Students.length) * 100) + "%"
        }}>
        </div>
    )
}