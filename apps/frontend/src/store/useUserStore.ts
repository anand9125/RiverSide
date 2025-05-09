import {create} from "zustand"

import axios from "axios"
import { API_URL } from "../config"

interface UserStore {
    user:any
    isLoading:boolean

    userSignup:(email:string,password:string,username:string)=>Promise<any>
    userSignin:(email:string,password:string)=>Promise<any>
}
export const uesUserStore = create<UserStore>((set) => ({
    user:null,
    isLoading:false,

    userSignup:async(email:string,password:string,username:string)=>{
        set({isLoading:true})
        try{
            const res = await axios.post(`${API_URL}/user/signup`,{email,password,username})
            set({user:res.data.user,isLoading:false})
            localStorage.setItem("token",res.data.token)
        }
        catch(e:any){
            set({isLoading:false})
            return e.response
        }
        
    },
    userSignin:async(email:string,password:string)=>{
        set({isLoading:true})
        try{
            const res = await axios.post(`${API_URL}/user/signin`,{email,password})
            set({user:res.data.user,isLoading:false})
            localStorage.setItem("token",res.data.token)
        }
        catch(e:any){
            set({isLoading:false})
            return e.response
        }
    }
}))
