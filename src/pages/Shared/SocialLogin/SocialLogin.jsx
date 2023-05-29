import { useContext } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { AuthContext } from '../../../providers/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';

const SocialLogin = () => {
    const { googleLogin } = useContext(AuthContext)
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleGoogleLogin = () => {
        googleLogin()
            .then(result => {
                const loggedUser = result.user;
                const savedUser = { name: loggedUser.displayName, email: loggedUser.email }
                fetch("http://localhost:5000/users", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(savedUser)
                })
                    .then(res => res.json())
                    .then(() => {
                        navigate(from, { replace: true })
                    })
            })
            .catch(err => console.log(err.message))
    }
    return (
        <div>
            <div className="divider">OR</div>
            <div className='w-full text-center my-4'>
                <button onClick={handleGoogleLogin} className="btn gap-2 ">
                    <FaGoogle />
                    Google
                </button>
            </div>
        </div>
    );
};

export default SocialLogin;