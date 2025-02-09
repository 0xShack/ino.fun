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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Twitter Handle</TableHead>
                <TableHead>Created On</TableHead>
                <TableHead>Fundraise Progress</TableHead>
                <TableHead>Days Remaining</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((enrollment) => (
                <TableRow 
                  key={enrollment.id} 
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => window.location.href = `/contribute/${enrollment.id}`}
                >
                  <TableCell className="font-medium">{enrollment.name}</TableCell>
                  <TableCell>{enrollment.twitter_handle}</TableCell>
                  <TableCell>{new Date(enrollment.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{`${enrollment.fundraise_percentage || 0}%`}</TableCell>
                  <TableCell>{calculateRemainingDays(enrollment.created_at)} days</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
} 