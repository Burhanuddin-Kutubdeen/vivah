
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedTransition from '@/components/AnimatedTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Mail } from "lucide-react";

// Form schema validation
const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Register = () => {
  const { signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { error, data } = await signUp(values.email, values.password, {
        firstName: values.firstName,
        lastName: values.lastName,
      });

      if (error) {
        setError(error.message);
      } else {
        // Check if email confirmation is required
        if (data && data.user && !data.session) {
          setRegistered(true);
          setRegisteredEmail(values.email);
          form.reset();
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-matrimony-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        
        <main className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
              {!registered ? (
                <>
                  <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
                    <p className="text-matrimony-600 dark:text-matrimony-300">
                      Join Vivah and start your journey
                    </p>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="your.email@example.com" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Your secure password" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Confirm your password" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full rounded-full bg-matrimony-600 hover:bg-matrimony-700 mt-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Creating account..." : "Create Account"}
                      </Button>

                      <div className="text-center mt-4">
                        <p className="text-sm text-matrimony-600 dark:text-matrimony-300">
                          Already have an account?{" "}
                          <Link to="/login" className="text-matrimony-700 dark:text-matrimony-400 font-medium hover:underline">
                            Log In
                          </Link>
                        </p>
                      </div>
                    </form>
                  </Form>
                </>
              ) : (
                <div className="text-center py-6">
                  <Mail className="mx-auto h-16 w-16 text-blue-500 mb-4" />
                  <h2 className="text-2xl font-bold mb-4">Verification Required</h2>
                  <Alert className="mb-6 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200">
                    <AlertTitle>Check your email</AlertTitle>
                    <AlertDescription className="mt-2">
                      We've sent a verification link to <strong>{registeredEmail}</strong>. 
                      <div className="mt-2">
                        Please check your inbox and click the verification link to activate your account. 
                        You won't be able to log in until your email is verified.
                      </div>
                    </AlertDescription>
                  </Alert>
                  <div className="mt-6 space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Already verified your email?
                    </p>
                    <Link to="/login">
                      <Button 
                        className="rounded-full bg-matrimony-600 hover:bg-matrimony-700"
                      >
                        Go to Login
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Register;
