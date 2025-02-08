import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

type SortOrder = 'asc' | 'desc';
type SortField = 'created_at' | 'name' | 'twitter_handle';

interface QueryParams {
  cursor?: string;
  limit?: number;
  orderBy?: SortField;
  order?: SortOrder;
}

function validateLimit(limit: any): number | null {
  const parsedLimit = parseInt(limit);
  if (isNaN(parsedLimit) || parsedLimit < 1) return null;
  if (parsedLimit > 100) return null;
  return parsedLimit;
}

function validateSortField(field: any): SortField | null {
  const validFields: SortField[] = ['created_at', 'name', 'twitter_handle'];
  return validFields.includes(field as SortField) ? field : null;
}

function validateSortOrder(order: any): SortOrder | null {
  if (order !== 'asc' && order !== 'desc') return null;
  return order;
}

function validateQueryParams(params: URLSearchParams): QueryParams | null {
  try {
    const limit = validateLimit(params.get('limit') ?? 10);
    if (!limit) return null;

    const orderBy = validateSortField(params.get('orderBy') ?? 'created_at'); 
    if (!orderBy) return null;

    const order = validateSortOrder(params.get('order') ?? 'desc');
    if (!order) return null;
    const cursor = params.get('cursor') || undefined;

    return {
      cursor,
      limit,
      orderBy,
      order
    };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const validatedParams = validateQueryParams(searchParams);

    if (!validatedParams) {
      return NextResponse.json({
        status: "error",
        message: "Invalid query parameters"
      }, { status: 400 });
    }

    const { cursor, limit, orderBy, order } = validatedParams;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let query = supabase
      .from('enrollments')
      .select('*')
      .order(orderBy, { ascending: order === 'asc' })
      .limit(limit + 1);

    if (cursor) {
      const operator = order === 'asc' ? 'gt' : 'lt';
      query = query[operator](orderBy, cursor);
    }

    const { data: rows, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({
        status: "error",
        message: "Failed to fetch enrollments"
      }, { status: 500 });
    }

    const hasMore = rows.length > limit;
    const data = rows.slice(0, limit);
    const nextCursor = hasMore ? data[data.length - 1][orderBy] : null;

    return NextResponse.json({
      status: "success",
      data,
      hasMore,
      nextCursor,
      meta: {
        limit,
        orderBy,
        order
      }
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({
      status: "error",
      message: "Internal server error"
    }, { status: 500 });
  }
}
