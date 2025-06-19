import axios from "axios"
import { useEffect } from "react"
import { useState } from "react"

export const Users = () =>{

    const [ users, setUsers ] = useState<any[]>([])
    const [ exams, setExams ] = useState([])

    useEffect(() =>{
        getUsers()
    }, [])
    const getUsers =  () =>{
        axios.get('http://localhost:80/api-quiz-app/user/').then(function(response){
            setUsers(response.data)
        }) 
    }
    const deleteUser = (userKey:any) => {
        console.log(userKey)
        axios.get(`http://localhost:80/api-quiz-app/exams.php/${userKey}`, userKey).then(function(response){
            setExams(response.data)
            
        }) 
        exams?.forEach((exam:any) => {
            console.log(exam.examKey)
            axios.delete(`http://localhost:80/api-quiz-app/exams.php/${exam.examKey}/delete`)
        })
        axios.delete(`http://localhost:80/api-quiz-app/index.php/${userKey}/delete`)
        getUsers()

        // fetch all from exams where userKey = userKey then assign all the examKeys to an array. array.forEach delete from... where examkey is this
    }
    return (
        <div className="user">
            Users <br />

            {
                users?.map((user, key) => (
                    <div key={key}>
                        <p>{key + 1}</p>
                        <p>{user.userName}</p>
                        <button
                            onClick={() => deleteUser(user.userKey)}
                        >Delete</button>
                    </div>
                ))
            }
        </div>
    )
}