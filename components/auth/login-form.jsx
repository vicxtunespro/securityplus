import React from 'react'
import { CardWrapper } from './card-wrapper'

export function LoginForm() {
  return (
    <CardWrapper
       headerLabel={"Welcome Back!"}
       backButtonLabel={"Don't have an account"}
       backButtonHref={"/register"}
       showSocial 
    >login-form</CardWrapper>
  )
}
