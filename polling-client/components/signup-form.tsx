"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface FormState {
  name:string,
  email:string,
  password:string,
  confirmPass:string
}
export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {

  const router = useRouter();

  const [formData,setFormData] = useState<FormState>({
    name:"",
    email:"",
    password:"",
    confirmPass:""
  });
  
  function handleChange (e:React.ChangeEvent<HTMLInputElement>){
    const {name,value} = e.target;
    
    setFormData((prev) => ({
      ...prev,
      
      [name]:value,
    }))
  }
  
  const handleSubmit =  async(e:any )=>{
    e.preventDefault();

    console.log("submitted form",formData);
    console.log("password",formData.password);
    console.log("confirm pass",formData.confirmPass);

    if(formData.password !== formData.confirmPass){
      console.log("password and confirm password not match");
      return;
    }
    const {name,email,password} = formData;

    const signup = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name,email,password}),
    });

    const data = await signup.json();
    console.log("signup data from backend",data);

    setFormData({
      name:"",
      email:"",
      password:"",
      confirmPass:"",
    })

    if(data.success){
      router.push("/login");
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} type="text" placeholder="John Doe"  required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="m@example.com"
                required
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" name="password" value={formData.password} onChange={handleChange} type="password" required />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" name="confirmPass" value={formData.confirmPass} onChange={handleChange} type="password" required />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Create Account</Button>
                {/* <Button variant="outline" type="button">
                  Sign up with Google
                </Button> */}
                <FieldDescription className="px-6 text-center">
                  Already have an account? <a href="#">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
