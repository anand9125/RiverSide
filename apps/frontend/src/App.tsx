import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import { Toaster } from "react-hot-toast";
import Room from "./pages/Room/Room";
import Main from "./pages/Dashboard/Main";
import { RecoilRoot } from 'recoil';
import Testroom from "./pages/Room";

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
         <Route path="/text" element={<Testroom/>}></Route>

      </Routes>
      <Toaster /> 
    </BrowserRouter>
   

    </div>
  
  );
}

export default App
