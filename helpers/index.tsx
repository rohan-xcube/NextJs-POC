import { getFromStorage } from '@/utils'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const AuthProvider:React.FC<any> = (props) => {
 const router = useRouter()

 const [userData, setUserData] = useState<any>({})

 useEffect(() => {
    setUserData(getFromStorage('USER_DATA'))
  }, [])

useEffect(()=>{
  getAuthentication();
},[userData])

  const getAuthentication = () => {
    const condArray = ["",null,undefined];
    const nonAuthRoutes = ["/login","/registration","/"]
    if(condArray.includes(userData) && !nonAuthRoutes.includes(router.route) && !userData?.email){
      router.replace("/");
    }
  }
  return (
    <>
    {props.children}
    </>
  )
}

export default AuthProvider