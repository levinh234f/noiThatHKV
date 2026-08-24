"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signOut({
      scope: "local",
    });

    if (error) {
      console.error("Logout error:", error);
      setLoading(false);
      return;
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="mt-8 h-[48px] w-full bg-[#6B7D65] text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "ĐANG ĐĂNG XUẤT..." : "ĐĂNG XUẤT"}
    </button>
  );
}