'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { UploadDropzone } from "@/utils/uploadthing";
import { Label } from "@/components/ui/label";
import Header from '@/components/Header';

interface Enrollment {
  id: string;
  name: string;
  twitter_handle: string;
  profile_image_url: string;
  amount: number;
  // Add other fields as needed
}

export default function ClaimPage() {
  const params = useParams();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [proofImage, setProofImage] = useState<{ url: string; key: string } | null>(null);
  const [isTwitterVerified, setIsTwitterVerified] = useState(false);

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const response = await fetch(`/api/funded/${params.id}`);
        const result = await response.json();

        if (result.status === 'success') {
          setEnrollment(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Failed to fetch enrollment data');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollment();
  }, [params.id]);

  const handleTwitterSignIn = async () => {
    try {
      const response = await fetch('/api/auth/twitter', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        // Verify if the authenticated user's handle matches the enrollment
        if (data.twitter_handle?.toLowerCase() === enrollment?.twitter_handle?.toLowerCase()) {
          setIsTwitterVerified(true);
        } else {
          alert('Please sign in with the correct Twitter account');
        }
      }
    } catch (err) {
      console.error('Twitter auth error:', err);
      alert('Failed to authenticate with Twitter');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Enrollment not found
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-4">
            {enrollment.profile_image_url && (
              <Image
                src={enrollment.profile_image_url}
                alt={enrollment.name}
                width={64}
                height={64}
                className="rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">{enrollment.name}</h1>
              <a
                href={`https://twitter.com/${enrollment.twitter_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {enrollment.twitter_handle}
              </a>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <p className="text-lg">
              Amount to claim: ${enrollment.amount?.toFixed(2)}
            </p>

            {!isTwitterVerified && (
              <button
                onClick={handleTwitterSignIn}
                className="w-full bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>Sign in with X</span>
              </button>
            )}

            {isTwitterVerified && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>X Account Verified</span>
              </div>
            )}

            <div className="space-y-2">
              <Label>Upload Proof of Nude (Required)</Label>
              {proofImage ? (
                <div className="relative aspect-video w-full">
                  <Image
                    src={proofImage.url}
                    alt="Proof of work"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ) : (
                <UploadDropzone
                  endpoint="proofImage"
                  onUploadBegin={() => {
                    // Optional: Show loading state
                  }}
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                      setProofImage({ 
                        url: res[0].url, 
                        key: res[0].key 
                      });
                    }
                  }}
                  onUploadError={(error: Error) => {
                    console.error(error);
                    alert('Error uploading image');
                  }}
                />
              )}
            </div>
            
            <button
              onClick={async () => {
                if (!proofImage) {
                  alert('Please upload proof of work first');
                  return;
                }
                if (!isTwitterVerified) {
                  alert('Please verify your X account first');
                  return;
                }

                try {
                  const response = await fetch(`/api/claim/${params.id}`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      proofImageUrl: proofImage.url,
                      proofImageKey: proofImage.key,
                    }),
                  });
                  const result = await response.json();
                  
                  if (result.status === 'success') {
                    alert('Successfully claimed!');
                  } else {
                    alert(result.message || 'Failed to claim');
                  }
                } catch (err) {
                  alert('Error processing claim');
                }
              }}
              disabled={!proofImage || !isTwitterVerified}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Claim Funds
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
