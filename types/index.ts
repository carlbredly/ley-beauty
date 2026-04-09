export interface Slot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  slot_id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  service: string;
  message?: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  slot?: Slot;
}

export interface BookingWithSlot extends Booking {
  slot: Slot;
}

export const SERVICES = [
  { name: "Box Braids", duration: "3h", price: 12000 },
  { name: "Knotless Braids", duration: "4h", price: 15000 },
  { name: "Cornrows", duration: "1h30", price: 7000 },
  { name: "Senegalese Twists", duration: "3h30", price: 13500 },
  { name: "Fulani Braids", duration: "2h", price: 9500 },
  { name: "Goddess Braids", duration: "2h30", price: 11000 },
] as const;

export type ServiceName = (typeof SERVICES)[number]["name"];
