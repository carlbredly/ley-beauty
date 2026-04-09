import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// POST /api/bookings/[id]/decline
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // 1. Fetch booking
  const { data: booking, error: fetchError } = await supabaseAdmin
    .from("bookings")
    .select("id, status, slot_id")
    .eq("id", id)
    .single();

  if (fetchError || !booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  if (booking.status !== "pending") {
    return NextResponse.json(
      { error: `Booking is already ${booking.status}.` },
      { status: 409 }
    );
  }

  // 2. Update booking status to declined
  const { error: updateError } = await supabaseAdmin
    .from("bookings")
    .update({ status: "declined" })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // 3. Release the slot back to available
  const { error: slotError } = await supabaseAdmin
    .from("slots")
    .update({ is_available: true })
    .eq("id", booking.slot_id);

  if (slotError) {
    console.error("Failed to release slot:", slotError);
  }

  return NextResponse.json({ success: true });
}
