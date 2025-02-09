'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Header from '@/components/Header'

interface Enrollment {
  id: string
  name: string
  twitter_handle: string
  created_at: string
  fundraise_percentage: number
  profile_image?: string
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
        <h1 className="text-3xl font-bold mb-8">Fund Test</h1>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Contributor Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted">
                  {enrollment.profile_image ? (
                    <img
                      src={enrollment.profile_image}
                      alt={`${enrollment.name}'s profile`}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <span className="text-2xl text-muted-foreground">
                        {enrollment.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="text-lg font-semibold">{enrollment.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Twitter Handle</p>
                    <p className="text-lg font-semibold">{enrollment.twitter_handle}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Created On</p>
                  <p className="text-lg font-semibold">
                    {new Date(enrollment.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Days Remaining</p>
                  <p className="text-lg font-semibold">
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

              <div>
                <p className="text-sm text-muted-foreground mb-2">Fundraise Progress</p>
                <Progress 
                  value={enrollment.fundraise_percentage || 0} 
                  className="w-full"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-lg font-semibold">
                    {enrollment.fundraise_percentage || 0}%
                  </p>
                  <p className="text-lg font-semibold">
                    $69,000
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardDescription>Contribute</CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Remove</CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Claim Funds</CardTitle>
              <CardDescription>
                Click below to claim your available funds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                onClick={() => {
                  router.push(`/claim/${params.id}`)
                }}
              >
                Claim
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}


