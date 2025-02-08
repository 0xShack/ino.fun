"use client";

import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <>
      <Header />
      <div className="container flex items-center justify-center min-h-screen py-8 m-0">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Enrollment Successful!</CardTitle>
            <CardDescription>
              Thank you for your initial nude offering
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 text-muted-foreground">
              Your enrollment has been confirmed. We'll review your submission and get back to you soon.
            </p>
            <Link href="/">
              <Button className="w-full">
                Return Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
