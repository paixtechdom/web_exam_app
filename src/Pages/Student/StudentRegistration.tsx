import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from "axios"
// import { AppContext } from "../../App"


export const StudentRegistration = () => {
    const schema = yup.object().shape({
        firstName: yup.string().required('User Name is required'),
        middleName: yup.string().required('User Name is required'),
        lastName: yup.string().required('User Name is required'),
        matricNumber: yup.string().required('User Name is required'),
        faculty: yup.string().required('User Name is required'),
        department: yup.string().required('User Name is required'),
        level: yup.string().required('User Name is required'),
        password: yup.string().min(6).max(18).required(),
        confirmPassword: yup.string().oneOf([yup.ref('password')], 'Password do not match').required(),
        approvalStatus: yup.string()
    })
    
    const { register, handleSubmit, formState: {errors}, setValue } = useForm({
        resolver: yupResolver(schema)
    })

    type ExamFormData = yup.InferType<typeof schema>;

    const addStudent = async (data: ExamFormData) =>{
        setValue('approvalStatus', 'pending')
        console.log(data)
        await axios.post('http://localhost:80/api-quiz-app/studentRegistration.php/students/save', data)
    }    
    return (

        <div>
           <input className="bg-blue" type="text" placeholder="First Name"  {...register('firstName')}/>
            <p className="error">{errors.firstName?.message}</p>

           <input className="bg-blue" type="text" placeholder="Middle Name"  {...register('middleName')}/>
            <p className="error">{errors.middleName?.message}</p>

           <input className="bg-blue" type="text" placeholder="Last Name"  {...register('lastName')}/>
            <p className="error">{errors.lastName?.message}</p>

           <input className="bg-blue" type="text" placeholder="Matric Number"  {...register('matricNumber')}/>
            <p className="error">{errors.matricNumber?.message}</p>

            <label htmlFor="">Falculty</label>
            <select id="" {...register('faculty')}>
                <option value="Pure and Applied Science">Pure and Applied Science</option>
                <option value="Art and Communication">Art and Communication</option>
                <option value="Management Sciences">Management Sciences</option>
                <option value="Social Sciences">Social Sciences</option>
            </select>
            {/* IF THE FALCULTY IS SELECTED FETCH ALL DEPARTMENTS UNDER THAT FALCULTY  */}
           {/* <input className="bg-blue" type="text" placeholder="Faculty"  {...register('faculty')}/> */}
            <p className="error">{errors.faculty?.message}</p>

            <label htmlFor="">Dapartment</label>
            <select id="" {...register('department')}>
                <option value="Computer Science">Computer Science</option>
                <option value="Management">Management</option>
                <option value="ict">ICT</option>
            </select>
            <p className="error">{errors.department?.message}</p>

            <label htmlFor="">Level</label>
            <select id="" {...register('level')}>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
            </select>
            <p className="error">{errors.level?.message}</p>


            <input type="text" placeholder="Password"  {...register('password')}/>
            <p className="error">{errors.password?.message}</p>

            <input type="text" placeholder="Confirm Password"  {...register('confirmPassword')}/>
            <p className="error">{errors.confirmPassword?.message}</p>

            {/* <p className="error">{errors.class?.message}</p> */}

            <button onClick={handleSubmit(addStudent)} className='action'> 
                    Add User
                </button>
    </div>
    )
}