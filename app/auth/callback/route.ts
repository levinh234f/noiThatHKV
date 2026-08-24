import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");
  const flowId = requestUrl.searchParams.get("sb_flow_id") ?? undefined;
  const type = requestUrl.searchParams.get("type");

  let next = requestUrl.searchParams.get("next") ?? "/";

  if (!next.startsWith("/")) {
    next = "/";
  }

  const isRecovery = type === "recovery" || next === "/reset-password";

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(
      code,
      flowId ? { flowId } : undefined
    );

    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  if (isRecovery) {
    return NextResponse.redirect(
      new URL("/forgot-password?error=recovery_failed", request.url)
    );
  }

  return NextResponse.redirect(
    new URL("/login?error=confirmation_failed", request.url)
  );
}
