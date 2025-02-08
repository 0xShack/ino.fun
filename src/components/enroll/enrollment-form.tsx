'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalInfoStep } from "./steps/personal-info";
import { SocialInfoStep } from "./steps/social-info";
import { ReviewStep } from "./steps/review";
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useRouter } from "next/navigation"

export type EnrollmentData = {
  personalInfo: {
    name: string;
    profilePicture: {
      url: string;
      key: string;
    } | null;
  };
  socialInfo: {
    twitterHandle: string;
  };
}

const INITIAL_DATA: EnrollmentData = {
  personalInfo: {
    name: "",
    profilePicture: null,
  },
  socialInfo: {
    twitterHandle: "",
  },
}

export function EnrollmentForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState(INITIAL_DATA);

  const steps = [
    { title: "Personal Information", component: PersonalInfoStep },
    { title: "Social Information", component: SocialInfoStep },
    { title: "Review", component: ReviewStep },
  ];

  function updateFields(fields: Partial<EnrollmentData>) {
    setData(prev => ({ ...prev, ...fields }));
  }

  function isStepValid(step: number): boolean {
    switch (step) {
      case 0: // Personal Info
        return Boolean(
          data.personalInfo.name && 
          data.personalInfo.profilePicture
        );
      case 1: // Social Info
        return Boolean(
          data.socialInfo.twitterHandle &&
          data.socialInfo.twitterHandle.startsWith('@')
        );
      default:
        return true;
    }
  }

  function next() {
    if (isStepValid(currentStep)) {
      setCurrentStep(c => c + 1);
    }
  }

  function back() {
    setCurrentStep(c => c - 1);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep !== steps.length - 1) {
      next();
      return;
    }

    try {
      const response: Response = await fetch('/api/launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.personalInfo.name,
          twitterHandle: data.socialInfo.twitterHandle,
          profilePicture: data.personalInfo.profilePicture,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorTitles: Record<string, string> = {
          INVALID_NAME: "Invalid Name",
          INVALID_TWITTER: "Invalid Twitter Handle",
          INVALID_PROFILE: "Invalid Profile Picture",
          DUPLICATE_TWITTER: "Twitter Handle Taken",
          DATABASE_ERROR: "Database Error",
          SERVER_ERROR: "Server Error"
        };

        toast({
          variant: "destructive",
          title: errorTitles[responseData.type] || "Error",
          description: responseData.message || 'Something Went Wrong',
        })
        return;
      }

      // If successful, redirect to success page
      router.push('/enroll/success');
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Unknown Error",
        description: "Failed to submit enrollment",
      })
      console.error('Enrollment error:', error);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <div className="flex gap-2">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className={`flex-1 h-2 rounded-full ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent data={data} updateFields={updateFields} />
          </CardContent>
          <CardFooter className="flex justify-between">
            {currentStep !== 0 && (
              <Button type="button" variant="outline" onClick={back}>
                Back
              </Button>
            )}
            <Button 
              type="submit"
              disabled={!isStepValid(currentStep)}
            >
              {currentStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </form>
      <Toaster />
    </div>
  );
} 