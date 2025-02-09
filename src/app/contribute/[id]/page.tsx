'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Header from '@/components/Header'

interface Enrollment {
  id: string
  name: string
  twitter_handle: string
  created_at: string
  fundraise_percentage: number
}

export default function ContributorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const response = await fetch(`/api/funded/${params.id}`)
        const data = await response.json()
        
        if (data.status === 'success') {
          setEnrollment(data.data)
        } else {
          setError('Failed to fetch enrollment details')
        }
      } catch (err) {
        setError('Failed to fetch enrollment details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEnrollment()
  }, [params.id])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>
  }

  if (!enrollment) {
    return <div className="flex justify-center items-center min-h-screen">Contributor not found</div>
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Fund</h1>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="border-b pb-4">
                <h2 className="text-sm text-gray-500">Name</h2>
                <p className="text-lg font-medium">{enrollment.name}</p>
              </div>
              
              <div className="border-b pb-4">
                <h2 className="text-sm text-gray-500">Twitter Handle</h2>
                <p className="text-lg font-medium">{enrollment.twitter_handle}</p>
              </div>

              <div className="border-b pb-4">
                <h2 className="text-sm text-gray-500">Created On</h2>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium">
                    {new Date(enrollment.created_at).toLocaleDateString()}
                  </p>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Days Remaining</p>
                    <p className="text-lg font-medium">
                      {Math.max(
                        90 - Math.floor(
                          (new Date().getTime() - new Date(enrollment.created_at).getTime()) 
                          / (1000 * 60 * 60 * 24)
                        ),
                        0
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pb-4">
                <h2 className="text-sm text-gray-500">Fundraise Progress</h2>
                <div className="mt-2">
                  <Progress 
                    value={enrollment.fundraise_percentage || 0} 
                    className="w-full"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-lg font-medium">
                      {enrollment.fundraise_percentage || 0}%
                    </p>
                    <p className="text-lg font-medium">
                      $69,000
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="flex-1"
                    onChange={(e) => {
                      // Handle contribute amount change
                      console.log('Contribute amount:', e.target.value)
                    }}
                  />
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      // Handle contribute action
                      console.log('Contribute clicked')
                    }}
                  >
                    Contribute
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="flex-1"
                    onChange={(e) => {
                      // Handle remove amount change
                      console.log('Remove amount:', e.target.value)
                    }}
                  />
                  <Button 
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      // Handle remove action
                      console.log('Remove clicked')
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Claim Funds</h2>
              <p className="text-sm text-gray-500">
                Click below to claim your available funds
              </p>
              <Button 
                className="w-full"
                onClick={() => {
                  router.push(`/claim/${params.id}`)
                }}
              >
                Claim
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
