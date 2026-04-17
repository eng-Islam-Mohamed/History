import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseEnv, hasSupabaseEnv } from '@/lib/supabase/env';

function cloneResponse(
  request: NextRequest,
  requestHeaders: Headers,
  response: NextResponse
) {
  const nextResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'content-length') {
      nextResponse.headers.set(key, value);
    }
  });

  response.cookies.getAll().forEach((cookie) => {
    nextResponse.cookies.set(cookie);
  });

  return nextResponse;
}

export async function updateSession(
  request: NextRequest,
  requestHeaders: Headers,
  response: NextResponse
) {
  if (!hasSupabaseEnv()) {
    return response;
  }

  let supabaseResponse = response;
  const { url, publishableKey } = getSupabaseEnv();

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        supabaseResponse = cloneResponse(request, requestHeaders, supabaseResponse);

        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.getUser();
  return supabaseResponse;
}
