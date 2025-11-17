import * as types from "./actionTypes"
import db from "../../db.json"

const getDataSuccess =(payload)=>{
    return {type:types.GETDATASUCCESS,payload}
}
const getDataRequest =()=>{
    return {type:types.GETDATAREQUEST}
}
const getDataFailure =()=>{
    return {type:types.GETDATAFAILURE}
}









export const getData = () =>(dispatch)=>{
    // console.log("data inner fun")
    dispatch(getDataRequest())
    try{
        // Prefer any admin-updated menu stored in localStorage under 'menuData'
        let dataToUse = db
        try{
            if (typeof window !== 'undefined'){
                const saved = localStorage.getItem('menuData')
                if (saved) dataToUse = JSON.parse(saved)
            }
        }catch(e){
            // ignore localStorage errors and fall back to bundled db
        }
        dispatch(getDataSuccess(dataToUse))
    }catch(err){
        dispatch(getDataFailure())
    }

}