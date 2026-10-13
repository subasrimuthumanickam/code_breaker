// src/api/guestApi.ts
import { API_BASE_URL } from "./api";

export interface GuestResponse {
  success: boolean;
  guest: { name: string };
}

/** Saves the guest nickname in the database (POST /api/wordscramble/guest). */
export async function registerGuest(nickname: string): Promise<GuestResponse> {
  const url = `${API_BASE_URL}/wordscramble/guest`;

  console.log("GUEST POST:", url, nickname);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname }),
  });

  const data = await res.json().catch(() => ({}));

  console.log("GUEST RESPONSE:", JSON.stringify(data));

  if (!res.ok || !(data as any)?.success) {
    throw new Error((data as any)?.error || `Request failed (${res.status})`);
  }

  return data as GuestResponse;
}