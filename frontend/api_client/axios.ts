import axios from "axios";

export const apiclient=axios.create({
    baseURL:"http://localhost:3001",
    withCredentials:true
});
