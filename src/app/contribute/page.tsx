'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from 'next/link'
import Header from '@/components/Header'

interface Enrollment {
  id: string
  name: string
  twitter_handle: string
  created_at: string
  fundraise_percentage: number  // Will be updated from smart contract in future
  profile_picture_url?: string  // Add this field
  // add other fields as needed
}

interface FetchResponse {
  status: string
  data: Enrollment[]
  hasMore: boolean
  nextCursor: string | null
  meta: {
    limit: number
    orderBy: string
    order: string
  }
}

const calculateRemainingDays = (createdAt: string): number => {
  const TOTAL_DAYS = 90;
  const created = new Date(createdAt);
  const today = new Date();
  const diffTime = today.getTime() - created.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, TOTAL_DAYS - diffDays);
}

export default function ContributePage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await fetch('/api/funded?limit=10&orderBy=created_at&order=desc')
        const data: FetchResponse = await response.json()
        
        if (data.status === 'success') {
          setEnrollments(data.data)
        } else {
          setError('Failed to fetch enrollments')
        }
      } catch (err) {
        setError('Failed to fetch enrollments')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEnrollments()
  }, [])

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">Loading...</div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Fund</h1>
        <div className="space-y-4">
          {/* Header */}
          <div className="hidden md:grid md:grid-cols-5 px-6 py-3 text-sm text-muted-foreground font-medium">
            <div className="w-[200px] flex items-center gap-4">Name</div>
            <div className="w-[150px]">Twitter Handle</div>
            <div className="w-[150px]">Created On</div>
            <div className="text-right w-[200px]">Fundraise Progress</div>
            <div className="text-right w-[150px]">Days Remaining</div>
          </div>

          {/* Rows */}
          {enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              onClick={() => window.location.href = `/contribute/${enrollment.id}`}
              className="rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="md:grid md:grid-cols-5 p-6 items-center">
                {/* Mobile View - Stacked Layout */}
                <div className="md:hidden space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      {enrollment.profile_picture_url ? (
                        <img
                          src={enrollment.profile_picture_url}
                          alt={`${enrollment.name}'s profile`}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <span className="text-lg text-muted-foreground">
                            {enrollment.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{enrollment.name}</div>
                      <div className="text-sm text-muted-foreground">{enrollment.twitter_handle}</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(enrollment.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${enrollment.fundraise_percentage || 0}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground text-sm min-w-[48px]">
                      {`${enrollment.fundraise_percentage || 0}%`}
                    </span>
                  </div>
                  <div className="font-medium">
                    {calculateRemainingDays(enrollment.created_at)} days remaining
                  </div>
                </div>

                {/* Desktop View - Grid Layout */}
                <div className="hidden md:flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    {enrollment.profile_picture_url ? (
                      <img
                        src={enrollment.profile_picture_url}
                        alt={`${enrollment.name}'s profile`}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-sm text-muted-foreground">
                          {enrollment.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="font-medium">{enrollment.name}</span>
                </div>
                <div className="hidden md:block text-muted-foreground">{enrollment.twitter_handle}</div>
                <div className="hidden md:block text-muted-foreground">
                  {new Date(enrollment.created_at).toLocaleDateString()}
                </div>
                <div className="hidden md:flex items-center justify-end gap-2">
                  <div className="w-[100px] h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${enrollment.fundraise_percentage || 0}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {`${enrollment.fundraise_percentage || 0}%`}
                  </span>
                </div>
                <div className="hidden md:block text-right font-medium">
                  {calculateRemainingDays(enrollment.created_at)} days
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
} 