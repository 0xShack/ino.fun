import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface PageProps {
  searchParams: {
    returnUrl?: string;
  };
}

export default async function AgeConsent({
  searchParams,
}: PageProps) {
  async function setConsent() {
    "use server";
    (await cookies()).set("age-consent", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
    
    const decodedReturnUrl = searchParams.returnUrl 
      ? decodeURIComponent(searchParams.returnUrl)
      : "/";
    
    redirect(decodedReturnUrl);
  }

  const returnUrl = await searchParams.returnUrl;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Age Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You must be 18 or older to access this site.
          </p>
        </CardContent>
        <CardFooter>
          <form action={setConsent} className="w-full">
            <Button 
              type="submit"
              className="w-full"
            >
              I am 18 or older
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}