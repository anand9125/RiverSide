import { useNavigate } from "react-router-dom";
import LoginForm from "../components/SigninForm";

const SigninPage = () => {
  const navigate = useNavigate();
 
  return (
    <div className="relative min-h-screen w-full bg-podcast-dark-blue">
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-podcast-studio bg-cover bg-center bg-no-repeat opacity-40"></div>
      
      {/* Colored gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-podcast-dark-blue/80 via-transparent to-black/70"></div>
      
      {/* Login container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <LoginForm />
          
          <p className="mt-8 text-center text-xs text-gray-400">
            By signing in, you agree to our{" "}
            <a href="#" className="hover:underline text-gray-300">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="hover:underline text-gray-300">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;