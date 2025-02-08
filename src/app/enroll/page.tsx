'use client';

import { redirect } from "next/navigation";
import { EnrollmentForm } from "@/components/enroll/enrollment-form";
import Header from '@/components/Header';

export default function EnrollmentPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <EnrollmentForm />
        </div>
      </div>
    </>
  );
} 