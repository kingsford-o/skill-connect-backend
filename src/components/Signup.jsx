import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';



const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    const { session, setSession, signUpNewUser } = UserAuth();
    console.log(session);

    const handleSignUp = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await signUpNewUser(email, password)

            if(result.success){
                navigate('/dashboard')
            } else {
    setError(result.error.message || "Signup failed");
  }
        } catch (error) {
            console.error(error)
            setError("an error occurred");
        } finally {
            setLoading(false);
        }
    }
    
  return (
    <div>
        <form onSubmit={handleSignUp} className='max-w-md m-auto pt-24'>
            <h2 className='font-bold pb-2 '>Sign up today!</h2>
            <p>
                Already have an accoubt? <Link to="/signin" >Sign In</Link>
            </p>
            <div className='flex flex-col py-4'>
                <input onChange={ (e) => setEmail(e.target.value)}
                 placeholder='Email'
                 className='p-3 mt-6 bg-green-600'
                  type="email" 
                  />
                <input onChange={(e) => setPassword(e.target.value)}
                 placeholder='Password' 
                 className='p-3 mt-6 bg-green-600'
                  type="password"
                   />
                <button type='submit' disabled={loading} className='mt-6 w-full'>
                    Sign up
                    </button>
                    {error && <p className='text-red-600 text-center pt-4'>{error}</p>}
            </div>
        </form>
    </div>
  )
};

export default Signup