'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalInfoStep } from "./steps/personal-info";
import { ContactInfoStep } from "./steps/contact-info";
import { PreferencesStep } from "./steps/preferences";
import { ReviewStep } from "./steps/review";

export type EnrollmentData = {
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  preferences: {
    notifications: boolean;
    newsletter: boolean;
    theme: 'light' | 'dark';
  };
}

const INITIAL_DATA: EnrollmentData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
  },
  contactInfo: {
    email: "",
    phone: "",
    address: "",
  },
  preferences: {
    notifications: false,
    newsletter: false,
    theme: 'light',
  },
}

export function EnrollmentForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState(INITIAL_DATA);

  const steps = [
    { title: "Personal Information", component: PersonalInfoStep },
    { title: "Contact Information", component: ContactInfoStep },
    { title: "Preferences", component: PreferencesStep },
    { title: "Review", component: ReviewStep },
  ];

  function updateFields(fields: Partial<EnrollmentData>) {
    setData(prev => ({ ...prev, ...fields }));
  }

  function next() {
    setCurrentStep(c => c + 1);
  }

  function back() {
    setCurrentStep(c => c - 1);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (currentStep === steps.length - 1) {
      // Submit the form data
      try {
        const response = await fetch('/api/enrollment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (response.ok) {
          window.location.href = '/enroll/success';
        }
      } catch (error) {
        console.error('Error submitting enrollment:', error);
      }
    } else {
      next();
    }
  }

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <form onSubmit={onSubmit}>
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
          <Button type="submit">
            {currentStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
} 