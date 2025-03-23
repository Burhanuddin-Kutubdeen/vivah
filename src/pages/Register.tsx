
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedTransition from '@/components/AnimatedTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RegistrationForm, { RegistrationFormValues } from '@/components/auth/RegistrationForm';
import RegistrationSuccess from '@/components/auth/RegistrationSuccess';

const Register = () => {
  const { signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");

  const handleSubmit = async (values: RegistrationFormValues) => {
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
                <RegistrationForm 
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  error={error}
                />
              ) : (
                <RegistrationSuccess email={registeredEmail} />
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
