import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthRoutes } from '../auth/routes/AuthRoutes'
import { FirebaseAuth } from '../firebase/config'
import { HomeRoutes } from '../principal/routes/HomeRoutes'
import { login, logout } from '../store/auth/authSlice'
import { CheckingAuth } from '../ui/components/CheckingAuth'

export const AppRoutes = () => {
  
  const { status } = useSelector( state => state.auth );
  const dispatch = useDispatch();

  useEffect(() => {
    
    onAuthStateChanged( FirebaseAuth, async( user ) => {
    
      if ( !user ) return dispatch( logout() );

      const { uid, email, displayName, photoURL } = user;
      dispatch( login({ uid, email, displayName, photoURL }))
    })
  
  }, [])
  

  if ( status === 'checking' ) {
    return <CheckingAuth />
  }

  return (
    <Routes>

      {
        ( status === 'authenticated')
          ? <Route path="/*" element={<HomeRoutes />} />
          : <Route path="/auth/*" element={ <AuthRoutes /> } />
      }

      <Route path='/*' element={ <Navigate to='/auth/login' /> } />

    </Routes>
  )
}
