import { useEffect, useState } from 'react'
import { dbLocation, TopLevelHeader } from '../../../assets/Constants'
import Cookie from 'js-cookie'
import { useUpdateStudentDetails } from '../../../assets/Hooks/useUpdateStudentDetails'
import axios from 'axios'
import { StudentReportTable } from './StudentReportTable'
import { useNavigate } from 'react-router-dom'
import { performanceInterface, PerformanceType } from '../../Admin/Pages/ExamReport/ExamReport'
import { AdminResultTableInterface } from '../../../assets/Interfaces'

// all exams the student has done in table format


export const StudentReports = () => {
  const [ isLoadingExams, setIsLoadingExams ] = useState(false)
  const [ results, setResults ] = useState([])
  const updateStudentDetails = useUpdateStudentDetails()  
  const cookiedUserDetails  = Cookie.get("userDetails")
  const navigate = useNavigate()
  // const studentslice = useSelector((state) => state.studentslice)  

  const [ performance, setPerformance ] = useState({
    passed: 0,
    average: 0,
    failed: 0
})

const UpdatePerformanceState = (type:PerformanceType) => {
    setPerformance({
        ...performance,
        [type]: performance[type] += 1
    })
}

  useEffect(() =>{
    document.documentElement.scrollTop=0
    
    if(cookiedUserDetails != undefined){
      if(cookiedUserDetails == "admin"){
        navigate("/login")
      }
      else{
        const cookiedStudentDetails = JSON.parse(cookiedUserDetails)
        updateStudentDetails(cookiedStudentDetails)      
        FetchReports(cookiedStudentDetails.id)
        setIsLoadingExams(true)
      }
    }else{
      navigate("/student_login")
    }

  }, [])
// 
  const FetchReports = (id:number) => {
    axios.get(`${dbLocation}/examResults.php/${id}/student`)
      .then((res) => {
        setResults(res.data)
        setIsLoadingExams(false)
        
        res.data.forEach((s :AdminResultTableInterface) => {
          let minScore = s.totalScore/2 - s.totalScore/20
          let maxScore = s.totalScore/2 + s.totalScore/20
          
          s.score >= maxScore ? UpdatePerformanceState("passed") : 
          s.score <= minScore ? UpdatePerformanceState("failed") : 
          s.score > minScore && s.score < maxScore ? UpdatePerformanceState("average") : ""


      })
      })
  }

  return (
    <main className='mt-[15vh] center'>
      <div className="w-11/12 flex flex-col gap-9">
        <h1 className={`${TopLevelHeader} `}>Exam Reports</h1>

        <PerformanceChart 
            results={results}
            performance={performance}
        />

        <StudentReportTable 
          data={results || []}
          currentPage={1}
          loading={isLoadingExams}
        />

      </div>
    </main>
  )
}

interface h {
  performance: performanceInterface,
  results: AdminResultTableInterface[]
}


const PerformanceChart = ({ performance, results }: h) => {


  return(
      <section className="flex w-full flex-col gap-3">

          <div className="flex w-full bg-gray-100 relative h-[2vh] rounded-full xl shadow-md overflow- y-visible overflow-hidden ">


              <PerformanceInfo 
                performance={performance.passed}
                color={"green-500"}
                results={results}
              />
      
              <PerformanceInfo 
                performance={performance.average}
                color={"gray-500"}
                results={results}
              />
      
              <PerformanceInfo 
                performance={performance.failed}
                color={"red-600"}
                results={results}
              />

          </div>

          <div className="flex items-center text-sm gap-5">
              <div className="center gap-1">
                  <p className="h-3 w-3 bg-green-500 rounded-full"></p>
                  Passed: {((performance.passed / results.length) * 100).toFixed(1)}%
              </div>
              <div className="center gap-1">
                  <p className="h-3 w-3 bg-gray-500 rounded-full"></p>
                  Average: {((performance.average / results.length) * 100).toFixed(1)}%
              </div>
              <div className="center gap-1">
                  <p className="h-3 w-3 bg-red-600 rounded-full"></p>
                  Failed: {((performance.failed / results.length) * 100).toFixed(1)}%
              </div>
          </div>
      </section>
  )

}

interface i {
  performance: number,
  color: string,
  results: AdminResultTableInterface[]

}

const PerformanceInfo = ({performance, color, results}: i) =>{
  return(
      <div className={`bg-${color} h-full relative h- [2vh]`} style={{
          width: ((performance / results.length) * 100) + "%"
      }}>
        <div className="absolute text-[12px] right-0 top-3">{(performance / results.length) * 100}%</div>
      </div>
  )
}