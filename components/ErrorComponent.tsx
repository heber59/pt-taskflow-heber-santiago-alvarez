'use client';

import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ErrorComponentProps } from '@/types';

export function ErrorComponent({ message, onRetry }: ErrorComponentProps) {
  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Alert variant="destructive" className="bg-red-50 border-red-200">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-900">Error Loading Tasks</AlertTitle>
        <AlertDescription className="text-red-800 mt-2">{message}</AlertDescription>
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="mt-4 border-red-300 text-red-600 hover:bg-red-100"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </Alert>
    </div>
  );
}
