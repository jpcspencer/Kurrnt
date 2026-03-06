import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const cookieHeader = request.headers.get("cookie") ?? "";
        const updates: Record<string, unknown> = {};

        const interestsMatch = cookieHeader.match(/kurrnt-interests=([^;]+)/);
        if (interestsMatch) {
          try {
            const interests = JSON.parse(decodeURIComponent(interestsMatch[1])) as string[];
            if (Array.isArray(interests) && interests.length > 0) {
              updates.interests = interests;
            }
          } catch {
            // Ignore parse errors
          }
        }

        const nameMatch = cookieHeader.match(/kurrnt-onboarding-name=([^;]+)/);
        if (nameMatch) {
          try {
            const displayName = decodeURIComponent(nameMatch[1]).trim();
            if (displayName) {
              updates.display_name = displayName;
            }
          } catch {
            // Ignore parse errors
          }
        }

        if (Object.keys(updates).length > 0) {
          await supabase.auth.updateUser({ data: updates });
        }
      }

      const response = NextResponse.redirect(`${origin}/feed`);
      response.cookies.set("kurrnt-interests", "", { maxAge: 0, path: "/" });
      response.cookies.set("kurrnt-onboarding-name", "", { maxAge: 0, path: "/" });
      return response;
    }
  }

  return NextResponse.redirect(`${origin}/onboarding?error=auth`);
}
