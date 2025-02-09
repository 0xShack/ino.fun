import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // First get the enrollment data
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('*')
      .eq('id', params.id)
      .single();

    if (enrollmentError) {
      console.error('Database error:', enrollmentError);
      return NextResponse.json({
        status: "error",
        message: "Failed to fetch enrollment"
      }, { status: 500 });
    }

    if (!enrollment) {
      return NextResponse.json({
        status: "error",
        message: "Enrollment not found"
      }, { status: 404 });
    }

    // Transform the data to include profile_image
    const transformedData = {
      ...enrollment,
      profile_image: enrollment.profile_picture_url || null,
    };

    return NextResponse.json({
      status: "success",
      data: transformedData
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({
      status: "error",
      message: "Internal server error"
    }, { status: 500 });
  }
} 