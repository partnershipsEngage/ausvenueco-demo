"use client";

import { DEMO_ITEMS, VENUE_SLUG } from "./demo-data";
import { EntryPayload, VenueItem } from "./types";
import { isSupabaseReady, supabase } from "./supabase";

const LOCAL_ITEMS_KEY = "brabham-demo-items";
const LOCAL_ENTRIES_KEY = "brabham-demo-entries";

function getLocalItems(): VenueItem[] {
  if (typeof window === "undefined") return DEMO_ITEMS;
  const raw = window.localStorage.getItem(LOCAL_ITEMS_KEY);
  if (!raw) return DEMO_ITEMS;
  try {
    return JSON.parse(raw) as VenueItem[];
  } catch {
    return DEMO_ITEMS;
  }
}

export async function loadItems(): Promise<VenueItem[]> {
  if (isSupabaseReady && supabase) {
    const { data, error } = await supabase
      .from("venue_items")
      .select("*")
      .eq("venue_slug", VENUE_SLUG)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (!error && data?.length) return data as VenueItem[];
  }
  return getLocalItems().filter((item) => item.is_active);
}

export async function loadAllItemsForAdmin(): Promise<VenueItem[]> {
  if (isSupabaseReady && supabase) {
    const { data, error } = await supabase
      .from("venue_items")
      .select("*")
      .eq("venue_slug", VENUE_SLUG)
      .order("sort_order", { ascending: true });

    if (!error && data) return data as VenueItem[];
  }
  return getLocalItems();
}

export async function submitEntry(payload: EntryPayload) {
  if (isSupabaseReady && supabase) {
    const { error } = await supabase.from("entries").insert(payload);
    if (error) throw error;
    return;
  }

  const current = JSON.parse(
    window.localStorage.getItem(LOCAL_ENTRIES_KEY) || "[]"
  );
  current.push({
    ...payload,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString()
  });
  window.localStorage.setItem(LOCAL_ENTRIES_KEY, JSON.stringify(current));
}

export async function saveItem(item: VenueItem) {
  if (isSupabaseReady && supabase) {
    const { error } = await supabase.from("venue_items").upsert(item);
    if (error) throw error;
    return;
  }

  const items = getLocalItems();
  const index = items.findIndex((x) => x.id === item.id);
  const next = [...items];
  if (index >= 0) next[index] = item;
  else next.push(item);
  window.localStorage.setItem(LOCAL_ITEMS_KEY, JSON.stringify(next));
}

export async function deleteItem(id: string) {
  if (isSupabaseReady && supabase) {
    const { error } = await supabase.from("venue_items").delete().eq("id", id);
    if (error) throw error;
    return;
  }

  const next = getLocalItems().filter((x) => x.id !== id);
  window.localStorage.setItem(LOCAL_ITEMS_KEY, JSON.stringify(next));
}
