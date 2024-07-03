import React from 'react'
import { redirect } from 'react-router-dom'
export const loader = ({ loginState, request, params })=>{
  console.log("dasboard loader")
  console.log(loginState)
  if(!loginState.login){
    console.log('please login')
    return redirect('/login')
  }
  return null
}
const DashBoard = () => {
  return (
    <div>DashBoard</div>
  )
}

export default DashBoard