import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendAdminNotification } from "@/lib/emails";
import type { BookingWithSlot } from "@/types";

// POST /api/bookings — Create a new booking
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slot_id, client_name, client_email, client_phone, service, message } = body;

    if (!slot_id || !client_name || !client_email || !service) {
      return NextResponse.json(
        { error: "slot_id, client_name, client_email, and service are required." },
        { status: 400 }
      );
    }

    // 1. Verify slot is available
    const { data: slot, error: slotError } = await supabaseAdmin
      .from("slots")
      .select("*")
      .eq("id", slot_id)
      .eq("is_available", true)
      .single();

    if (slotError || !slot) {
      return NextResponse.json(
        { error: "This time slot is no longer available. Please select another." },
        { status: 409 }
      );
    }

    // 2. Mark slot as unavailable (atomic)
    const { error: lockError } = await supabaseAdmin
      .from("slots")
      .update({ is_available: false })
      .eq("id", slot_id)
      .eq("is_available", true); // double-check

    if (lockError) {
      return NextResponse.json(
        { error: "Failed to lock slot. Please try again." },
        { status: 500 }
      );
    }

    // 3. Create booking
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .insert({
        slot_id,
        client_name: client_name.trim(),
        client_email: client_email.trim().toLowerCase(),
        client_phone: client_phone?.trim() ?? null,
        service,
        message: message?.trim() ?? null,
        status: "pending",
      })
      .select()
      .single();

    if (bookingError || !booking) {
      // Rollback: release slot
      await supabaseAdmin
        .from("slots")
        .update({ is_available: true })
        .eq("id", slot_id);
      return NextResponse.json({ error: "Failed to create booking." }, { status: 500 });
    }

    // 4. Send admin notification email
    try {
      const bookingWithSlot: BookingWithSlot = { ...booking, slot };
      await sendAdminNotification(bookingWithSlot);
    } catch (emailErr) {
      console.error("Failed to send admin email:", emailErr);
      // Non-fatal — booking still created
    }

    return NextResponse.json({ booking }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}

// GET /api/bookings?admin=true — fetch all bookings (admin)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const isAdmin = searchParams.get("admin") === "true";

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*, slot:slots(*)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookings: data });
}
