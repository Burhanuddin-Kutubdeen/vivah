
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const DiscoveryOfflineAlert: React.FC = () => {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTitle>Connection Issue</AlertTitle>
      <AlertDescription>
        You are currently offline. Some features may be limited until your connection is restored.
      </AlertDescription>
    </Alert>
  );
};

export default DiscoveryOfflineAlert;
