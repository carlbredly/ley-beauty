import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// DELETE /api/slots/[id] — admin: delete a slot
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Only allow deleting available (non-booked) slots
  const { data: slot, error: fetchError } = await supabaseAdmin
    .from("slots")
    .select("id, is_available")
    .eq("id", id)
    .single();

  if (fetchError || !slot) {
    return NextResponse.json({ error: "Slot not found." }, { status: 404 });
  }

  if (!slot.is_available) {
    return NextResponse.json(
      { error: "Cannot delete a booked slot." },
      { status: 409 }
    );
  }

  const { error } = await supabaseAdmin.from("slots").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
