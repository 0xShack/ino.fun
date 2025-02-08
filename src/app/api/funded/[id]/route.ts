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

    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({
        status: "error",
        message: "Failed to fetch enrollment"
      }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({
        status: "error",
        message: "Enrollment not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      status: "success",
      data
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({
      status: "error",
      message: "Internal server error"
    }, { status: 500 });
  }
} 