import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import { Toaster } from "react-hot-toast";


function App() {

  return (
    <div>
   
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/signin" element={<SigninPage/>} />
        <Route path="/signup" element={<SignupPage/>} />
  
      </Routes>
      <Toaster /> 
    </BrowserRouter>

    </div>
  
  );
}

export default App
