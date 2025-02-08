'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

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
          
          <button
            onClick={async () => {
              try {
                const response = await fetch(`/api/claim/${params.id}`, {
                  method: 'POST',
                });
                const result = await response.json();
                
                if (result.status === 'success') {
                  // You might want to show a success message or redirect
                  alert('Successfully claimed!');
                } else {
                  alert(result.message || 'Failed to claim');
                }
              } catch (err) {
                alert('Error processing claim');
              }
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Claim Funds
          </button>
        </div>
      </div>
    </div>
  );
}
