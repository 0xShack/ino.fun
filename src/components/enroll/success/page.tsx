import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EnrollmentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Enrollment Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Thank you for completing your enrollment. We'll be in touch shortly.
          </p>
          <Link href="/">
            <Button className="w-full">Return to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
} 