
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { validateEmail } from "@/lib/auth-utils";

// Form schema validation
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
});

// Forgot password form schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const Login = () => {
  const { signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Login form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Forgot password form
  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during login");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for forgot password form
  const onForgotPasswordSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (!validateEmail(values.email)) {
        setError("Please enter a valid email address");
        setIsSubmitting(false);
        return;
      }

      // Import resetPassword dynamically to avoid circular dependencies
      const { resetPassword } = await import("@/lib/auth-utils");
      const { error } = await resetPassword(values.email);

      if (error) {
        setError(error.message);
      } else {
        setResetEmailSent(true);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowForgotPassword(!showForgotPassword);
    setError(null);
    setResetEmailSent(false);
  };

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-matrimony-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        
        <main className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
              <div className="text-center mb-6">
                {showForgotPassword ? (
                  <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
                ) : (
                  <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                )}
                
                {showForgotPassword ? (
                  <p className="text-matrimony-600 dark:text-matrimony-300">
                    Enter your email to receive reset instructions
                  </p>
                ) : (
                  <p className="text-matrimony-600 dark:text-matrimony-300">
                    Sign in to continue your journey
                  </p>
                )}
              </div>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {resetEmailSent && (
                <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>
                    Password reset instructions have been sent to your email address.
                    Please check your inbox and follow the instructions.
                  </AlertDescription>
                </Alert>
              )}

              {!showForgotPassword ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                              placeholder="Your password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="text-right">
                      <button 
                        onClick={toggleForgotPassword}
                        className="text-sm text-matrimony-700 dark:text-matrimony-400 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full rounded-full bg-matrimony-600 hover:bg-matrimony-700 mt-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>

                    <div className="text-center mt-4">
                      <p className="text-sm text-matrimony-600 dark:text-matrimony-300">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-matrimony-700 dark:text-matrimony-400 font-medium hover:underline">
                          Create Account
                        </Link>
                      </p>
                    </div>
                  </form>
                </Form>
              ) : (
                <Form {...forgotPasswordForm}>
                  <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={forgotPasswordForm.control}
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

                    <Button 
                      type="submit" 
                      className="w-full rounded-full bg-matrimony-600 hover:bg-matrimony-700 mt-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Reset Instructions"}
                    </Button>

                    <div className="text-center mt-4">
                      <button 
                        onClick={toggleForgotPassword}
                        className="text-sm text-matrimony-700 dark:text-matrimony-400 font-medium hover:underline"
                      >
                        Back to login
                      </button>
                    </div>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Login;
