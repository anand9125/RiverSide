import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import { Toaster } from "react-hot-toast";
import Room from "./pages/Room";


function App() {

  return (
    <div>
   
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/signin" element={<SigninPage/>} />
        <Route path="/signup" element={<SignupPage/>} />
         <Route path="/dashboard" element={<Room/>} /> {/* TODO: Add dashboard page */}
      </Routes>
      <Toaster /> 
    </BrowserRouter>

    </div>
  
  );
}

export default App
