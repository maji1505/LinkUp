
import axios from 'axios'

export const axiosInstance=axios.create({
    baseURL:import.meta.env.MODE==="development"?"http://localhost:5001/api":"/api",  
    withCredentials:true,          
})





 //You don't need to configure baseURL or withCredentials every time you make a request.
 //Purpose: Indicates whether cross-site Access-Control requests should 
 // include credentials such as cookies or authentication headers.