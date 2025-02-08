import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

type ProfilePicture = {
  url: string;
  key: string;
}

type EnrollmentData = {
  name: string;
  twitterHandle: string;
  profilePicture: ProfilePicture;
}

function validateName(name: string): string | null {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (name.length > 50) return "Name must be less than 50 characters";
  return null;
}

function validateTwitterHandle(handle: string): string | null {
  if (!handle) return "Twitter handle is required";
  if (!handle.startsWith('@')) return "Twitter handle must start with @";
  if (!/^@[A-Za-z0-9_]{1,15}$/.test(handle)) {
    return "Invalid Twitter handle format";
  }
  return null;
}

function validateProfilePicture(profilePicture: any): string | null {
  if (!profilePicture) return "Profile picture is required";
  if (!profilePicture.url || typeof profilePicture.url !== 'string') {
    return "Invalid profile picture URL";
  }
  if (!profilePicture.key || typeof profilePicture.key !== 'string') {
    return "Invalid profile picture key";
  }
  try {
    new URL(profilePicture.url);
  } catch {
    return "Invalid profile picture URL format";
  }
  return null;
}

function validateEnrollmentData(data: any): { 
  validatedData?: EnrollmentData;
  error?: { type: string; message: string; };
} {
  const { name, twitterHandle, profilePicture } = data;

  const nameError = validateName(name);
  if (nameError) {
    return { error: { type: "INVALID_NAME", message: nameError }};
  }

  const twitterError = validateTwitterHandle(twitterHandle);
  if (twitterError) {
    return { error: { type: "INVALID_TWITTER", message: twitterError }};
  }

  const profileError = validateProfilePicture(profilePicture);
  if (profileError) {
    return { error: { type: "INVALID_PROFILE", message: profileError }};
  }

  return { validatedData: { name, twitterHandle, profilePicture }};
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validation = validateEnrollmentData(body);
    if (validation.error) {
      return NextResponse.json({
        status: "error",
        type: validation.error.type,
        message: validation.error.message
      }, { status: 400 });
    }

    const { name, twitterHandle, profilePicture } = validation.validatedData!;

    // Initialize regular Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if Twitter handle already exists
    const { data: existingUser } = await supabase
      .from('enrollments')
      .select('twitter_handle')
      .eq('twitter_handle', twitterHandle)
      .single();

    if (existingUser) {
      return NextResponse.json({
        status: "error",
        type: "DUPLICATE_TWITTER",
        message: "This Twitter handle is already enrolled"
      }, { status: 400 });
    }

    // Insert the enrollment data
    const { error: supabaseError } = await supabase
      .from('enrollments')
      .insert({
        name,
        twitter_handle: twitterHandle,
        profile_picture_url: profilePicture.url,
        profile_picture_key: profilePicture.key,
        published_on_chain: false,
      });

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      return NextResponse.json({
        status: "error",
        type: "DATABASE_ERROR",
        message: "Failed to save enrollment"
      }, { status: 500 });
    }

    return NextResponse.json({
      status: "success",
      body: {
        name,
        twitterHandle,
        profilePicture
      }
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({
      status: "error", 
      type: "SERVER_ERROR",
      message: "Internal server error"
    }, { status: 500 });
  }
}