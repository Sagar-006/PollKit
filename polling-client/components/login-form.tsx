"use client"
import { cn } from "@/lib/utils"
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
import { useState } from "react";
import { useRouter } from "next/navigation"
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";


interface FormData {
  email:string,
  password:string
}
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const router = useRouter();

  const [formData,setFormData] = useState<FormData>({
    email:"",
    password:""
  });
  const [loading,setLoading] = useState<boolean>(false);

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name,value} = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:value
    }))
  };

  const handleSubmit = async(e:any) => {
    
    try{
      e.preventDefault();
      setLoading(true);
      const { email, password } = formData;

      const login = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await login.json();

      if (!login.ok) {
        // ✅ API errors (400, 401) come here — show backend message
        toast.error(data.message || "Something went wrong.");
        return;
      }
      
      if (data.success) {
        toast.success(data.message);
        setFormData({
          email: "",
          password: "",
        });
        router.push(redirect || "/dashboard");
      }
    }catch(e:any) {
      toast.error("Network error. Please try again.");
    }finally{
      setLoading(false)
    }

  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="john@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" name="password" value={formData.password} onChange={handleChange} type="password" required />
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Logging...": "Login" }
                </Button>
                
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/signup">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
