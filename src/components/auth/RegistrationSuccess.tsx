
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface RegistrationSuccessProps {
  email: string;
}

const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({ email }) => {
  return (
    <div className="text-center py-6">
      <Mail className="mx-auto h-16 w-16 text-blue-500 mb-4" />
      <h2 className="text-2xl font-bold mb-4">Verification Required</h2>
      <Alert className="mb-6 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200">
        <AlertTitle>Check your email</AlertTitle>
        <AlertDescription className="mt-2">
          We've sent a verification link to <strong>{email}</strong>. 
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
  );
};

export default RegistrationSuccess;
