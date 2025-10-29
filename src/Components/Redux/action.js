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
        // Use local hardcoded data from src/db.json instead of calling an external API
        dispatch(getDataSuccess(db))
    }catch(err){
        dispatch(getDataFailure())
    }

}