import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SigninPage from "./pages/userAuth/SigninPage";
import SignupPage from "./pages/userAuth/SignupPage";
import { Toaster } from "react-hot-toast";
import Main from "./pages/Dashboard/Main";
import Room from "./pages/Room/Room";


function App() {
    

  return (
    <div>
   
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/signin" element={<SigninPage/>} />
        <Route path="/signup" element={<SignupPage/>} />
         <Route path="/dashboard/" element={<Main/>} /> {/* TODO: Add dashboard page */}
         <Route path="/dashboard/:roomId" element={<Room/>} />
        

      </Routes>
      <Toaster /> 
    </BrowserRouter>
   

    </div>
  
  );
}

export default App
