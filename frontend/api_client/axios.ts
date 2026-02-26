import axios from "axios";

export const apiclient=axios.create({
    baseURL:"http://localhost:3002",
    withCredentials:true,
});
