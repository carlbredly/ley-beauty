import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendClientConfirmation } from "@/lib/emails";
import type { BookingWithSlot } from "@/types";

const VALID_STATUSES = ["pending", "accepted", "declined"] as const;
type BookingStatus = (typeof VALID_STATUSES)[number];

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  let status: BookingStatus;
  try {
    const body = await req.json();
    status = body.status;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  const { data: booking, error: fetchError } = await supabaseAdmin
    .from("bookings")
    .select("*, slot:slots(*)")
    .eq("id", id)
    .single();

  if (fetchError || !booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  const previousStatus = booking.status;

  const { error: updateError } = await supabaseAdmin
    .from("bookings")
    .update({ status })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  if (status === "declined" && previousStatus !== "declined") {
    await supabaseAdmin
      .from("slots")
      .update({ is_available: true })
      .eq("id", booking.slot_id);
  }

  if (status === "pending" || status === "accepted") {
    if (previousStatus === "declined") {
      await supabaseAdmin
        .from("slots")
        .update({ is_available: false })
        .eq("id", booking.slot_id);
    }
  }

  if (status === "accepted" && previousStatus !== "accepted") {
    try {
      const bookingWithSlot: BookingWithSlot = { ...booking, slot: booking.slot };
      await sendClientConfirmation(bookingWithSlot);
    } catch (emailErr) {
      console.error("Failed to send confirmation email:", emailErr);
    }
  }

  return NextResponse.json({ success: true, status });
}
