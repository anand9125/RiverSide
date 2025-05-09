import React, { useState } from "react";
import { Button } from "./Button";
import { Input } from "./input";
import { Label } from "./label.";
import { Checkbox } from "./checkbox";
import { Mic, Headphones } from "lucide-react";
import  toast from "react-hot-toast";
import { uesUserStore } from "../store/useUserStore";
import { useNavigate } from "react-router-dom";

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  
  const { userSignup,isLoading } = uesUserStore();
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password ||!name) {
      toast.error("Please fill in all the fields");
      return;
    }
    userSignup(email,password,name)
    if(localStorage.getItem("token")){
      navigate("/dashboard")
    }
    // Simulate login request
    setTimeout(() => {
      
       toast.success("You have been logged in successfully!");
    }, 1500);
  };

  return (
    <div className="glass-card w-full max-w-md p-8 rounded-xl animate-fade-in">
      <div className="flex items-center justify-center mb-6 space-x-2">
        <Mic className="h-8 w-8 text-podcast-accent-red" />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-yellow-500 to-cyan-500 bg-clip-text text-transparent">
        AudioCast
      </h2>

        <Headphones className="h-8 w-8 text-podcast-accent-blue" />
      </div>
      
      <h3 className="text-xl font-medium text-center mb-6 text-white">Sign up to your account</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-200">Username</Label>
          <Input 
            id="name" 
            type="name" 
            placeholder="Anand"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-200">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-gray-200">Password</Label>
            <a href="#" className="text-xs text-podcast-accent-blue hover:underline">
              Forgot password?
            </a>
          </div>
          <Input 
            id="password" 
            type="password"
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
          />
        </div>
        
        <div className="flex items-center space-x-2">
        <Checkbox
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}/>

          <Label htmlFor="remember" className="text-sm text-gray-200">
            Remember me
          </Label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full border rounded-xl bg-gradient-to-r from-podcast-accent-red to-podcast-accent-blue hover:opacity-90 transition-opacity"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
        
        <div className="text-center text-sm text-gray-300">
          Already have an account?{" "}
          <a href="/signin" className="text-podcast-accent-blue hover:underline">
            Sign in
          </a>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
