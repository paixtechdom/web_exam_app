import { DataCard } from "../../../Components/DataCard"
import { FC, useEffect, useState } from "react"
import { TopLevelHeader } from "../../../assets/Constants"
import { setShowTopNav } from "../../../assets/store/NavigationSlice"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../assets/store/AppStore"
// import { OrdersTable } from "../../Components/Table/Tables"



const Dashboard = () => {
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(setShowTopNav(true))
    }, [])

    return(
        <main className="flex w-full min-h-screen center lg:pt-[20vh] pt-[12vh] bg-gray-100">
            <div className="w-11/12 flex flex-col gap-5 min-h-screen">
                <h1 className={`${TopLevelHeader} cursor-pointer`}
                
                onClick={() => {
                    dispatch(setShowTopNav(true))
                    console.log("Ddd")
                    }}>Welcome Back Admin 👋🏿</h1>

                {/* ******** STASTICS ************* */}
                <div className="flex flex-col gap-9">
                    <div className="flex flex-col w-full ">

                        <div className="grid grid-cols-2 lg:grid-cols-4 w-full  gap-5 bg-red-3 00">
                            <DataCard className={'bg-blue-200'} data={'Total Exams'} icon={'book-fill'} value={'3'}/>
                            
                            <DataCard className={'bg-blue-100'} data={'Students'} icon={'people-fill'} value={'+120'}/>

                            <DataCard className={'bg-blue-50'}  data={'Average Scores'} icon={'bar-chart-fill'} value={'66%'}/>

                            <DataCard data={'Reports'} icon={'award-fill'} value={'9'}/>
                        </div>

                    
                        <div className="flex flex-col lg:flex-row lg:gap-9">

                            <div className="flex flex-col my-[5ch] text-gray-900 gap-5 w-full">
                                <div className="flex gap-9 items-end text-xl text-primary">
                                    <h2 className={`font-bold text-gray-700 text-2xl`}>Average Scores (%)</h2>
                                </div>
                                <BarChart />
                            </div>

                            <div className="flex flex-col mb-[5ch] lg:my-[5ch] text-gray-900 gap-5">

                                <div className="flex gap-9 items-end text-xl text-primary">
                                    <h2 className={`font-bold text-gray-700 text-2xl`}>Recent Activities</h2>
                                </div>

                                <NotificationList />                            

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}


const notificationList = [
    {
        info: "Created the exam - BUS 201",
        time: "Just now"
    },
    {
        info: "5 sudents submitted the exam, PHY 302",
        time: "5 min ago"
    },
    {
        info: "You deleted the exam, FRN 209",
        time: "3 hrs ago"
    },
    {
        info: "You added 6 new questions to the exam,  MTH 112",
        time: "2 June, 2025"
    },
    {
        info: "You imported 20 new questions to the exam,  MTH 112",
        time: "31 May, 2025"
    },
    // {
    //     info: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor eaque laudantium veritatis nesciunt maxime nostrum commodi cum ea dignissimos, laborum cumque officia impedit nisi nemo, error, perspiciatis incidunt molestiae facere.",
    //     time: "31 May, 2025"
    // },
    // {
    //     info: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor eaque laudantium veritatis nesciunt maxime nostrum commodi cum ea dignissimos, laborum cumque officia impedit nisi nemo, error, perspiciatis incidunt molestiae facere.",
    //     time: "30 May, 2025"
    // },
    // {
    //     info: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor eaque laudantium veritatis nesciunt maxime nostrum commodi cum ea dignissimos, laborum cumque officia impedit nisi nemo, error, perspiciatis incidunt molestiae facere.",
    //     time: "30 May, 2025"
    // },
    // {
    //     info: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor eaque laudantium veritatis nesciunt maxime nostrum commodi cum ea dignissimos, laborum cumque officia impedit nisi nemo, error, perspiciatis incidunt molestiae facere.",
    //     time: "30 May, 2025"
    // },
    // {
    //     info: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor eaque laudantium veritatis nesciunt maxime nostrum commodi cum ea dignissimos, laborum cumque officia impedit nisi nemo, error, perspiciatis incidunt molestiae facere.",
    //     time: "29 May, 2025"
    // },
]

export const NotificationList = () =>{


    return(
        <section className="flex flex-col bg-white rounded-2xl overflow-hidden border shadow-xl divide-y divide-gray-300 p-3">
            {notificationList.map((n ,i) => (
                i < 5 &&

                <div key={i} className="flex flex-col py-2 p-2 hover:bg-gray-200 cursor-pointer transition-all duration-500 rounded-xl">
                    <p className="text-sm">{n.info.slice(0, 114)}...</p>
                    <p className="text-[12px] text-blue-950">{n.time}</p>
                </div>
            ))}
        </section>
    )
}


interface DummyScoresInterface {
    examTitle: string,
    scoresList: number[],
    totalScore: number
}


const BarChartDummyScores: DummyScoresInterface[] = [
    {
        examTitle: "PHY 101",
        scoresList: [70, 80, 44, 79, 45, 78, 87, 82, 54, 67, 75],
        totalScore: 100
    },
    {
        examTitle: "ENT 114",
        scoresList: [80, 89, 74, 79, 85, 88, 77, 93, 84, 87, 85],
        totalScore: 100
    },
    {
        examTitle: "MTH 113",
        scoresList: [45, 56, 34, 49, 45, 68, 67, 52, 44, 37, 65],
        totalScore: 100
    },
    {
        examTitle: "CHEM 114",
        scoresList: [80, 89, 74, 79, 85, 88, 77, 93, 84, 87, 85],
        totalScore: 100
    },
    {
        examTitle: "ENG 101",
        scoresList: [65, 55, 54, 69, 50, 68, 70, 70, 75, 57, 65],
        totalScore: 100
    },
    {
        examTitle: "CSC 105",
        scoresList: [80, 75, 45, 69, 63, 58, 82, 67, 71, 63, 70],
        totalScore: 100
    },
    {
        examTitle: "GNS 113",
        scoresList: [45, 56, 54, 49, 45, 68, 67, 52, 44, 37, 65],
        totalScore: 100
    },
    {
        examTitle: "GNS 201",
        scoresList: [65, 55, 54, 69, 50, 68, 70, 70, 75, 57, 65],
        totalScore: 100
    },
    {
        examTitle: "CSC 207",
        scoresList: [80, 75, 85, 69, 63, 78, 82, 67, 71, 83, 70],
        totalScore: 100
    }
]

export const BarChart = () => {
    const graphPoints = [100, 80, 60, 40, 20]
    return(
        <section className="w-full flex flex-col gap-9 bg-white rounded-2xl shadow-xl p-6 px-7 pb-[7vh]">
            <div className="flex justify-between relative">

                <div className={`absolute flex flex-col justify-between divide-y divide-gray-400 w-full bottom-0 border-y border-gray-400 bg -gray-700 bg-opacity-25 h-full`}>
                    {graphPoints.map((g, i) => (
                        <div key={i} className="w-full h-full text-[10px] font-bold relative">
                            <span className="ml-[-10px]">
                                {g}%
                            </span> 
                        </div>

                    ))}
                </div>


                {BarChartDummyScores.map((score: DummyScoresInterface, i) => (
                    <div key={i} className="flex items-center flex-col justify-end h-[40vh] gap-2 relative w-full">

                        <Bar scores={score}/>

                        <p className="text-[12px] font-bold absolute bottom-[-25px] w-90 bg-r ed-300">
                            {score.examTitle.slice(0, 8)}
                        </p>
                    </div>
                ))}
            </div>
            

            {/* <p className="ext-sm">Lorem ipsum dolor sit</p> */}

        </section>
    )
}
export default Dashboard 


interface BarInterface{
    scores: DummyScoresInterface

}

const Bar:FC <BarInterface> = ({scores}) => {
    const [ height, setHeight ] = useState(1)

    /*
        sum of all scores / number of results = average score

        avegrage score / 100 * total score
    */

    useEffect(() => {
        const sumOfAllScores = scores.scoresList.reduce((sum: number, current) => sum + current, 0);
        let averageScore = sumOfAllScores / scores.scoresList.length

        setHeight((averageScore/100) * scores.totalScore)
    }, [])


    return(
        <div className={`rounded-lg bg-green-600 w-9 transition-all ease-in-out duration-1000`}
        style={{
            height: height + "%"
        }}
        >
        </div>
    )
}