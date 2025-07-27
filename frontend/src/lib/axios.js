import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL:'http://localhost:5001/api', // Update with your backend URL
    withCredentials: true, // send cookies with the requests
})
  
