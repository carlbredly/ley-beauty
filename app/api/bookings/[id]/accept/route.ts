import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendClientConfirmation } from "@/lib/emails";
import type { BookingWithSlot } from "@/types";

// POST /api/bookings/[id]/accept
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // 1. Fetch booking with slot
  const { data: booking, error: fetchError } = await supabaseAdmin
    .from("bookings")
    .select("*, slot:slots(*)")
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

  // 2. Update status to accepted
  const { error: updateError } = await supabaseAdmin
    .from("bookings")
    .update({ status: "accepted" })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // 3. Send confirmation email to client
  try {
    const bookingWithSlot: BookingWithSlot = {
      ...booking,
      slot: booking.slot,
    };
    await sendClientConfirmation(bookingWithSlot);
  } catch (emailErr) {
    console.error("Failed to send confirmation email:", emailErr);
  }

  return NextResponse.json({ success: true });
}
