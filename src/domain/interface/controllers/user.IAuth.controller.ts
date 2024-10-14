import {Request,Response, NextFunction } from "express";

export interface IuserAuthenticationController {
   UserRegistrationRequest(req:Request,res:Response,next:NextFunction):Promise<void>;
   confirmOtpRequest(req:Request,res:Response,next:NextFunction):Promise<void>;
   UserLoginRequest(req:Request,res:Response,next:NextFunction):Promise<void>
   UserLogoutRequest(req:Request,res:Response,next:NextFunction):Promise<void>
}

export interface IUserLoginCredentials {
    email:string;
    password:string;
}

export interface IUserRegisterCredentials {
    name:string;
    email:string;
    password: string;
    confirmPassword: string;
}

export interface OTPData {
    email: string;        
    enteredOtp: string;   
  }