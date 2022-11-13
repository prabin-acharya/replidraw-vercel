import { ReadTransaction, WriteTransaction } from "replicache";
import { z } from "zod";

export const markerPrefix = `marker-`;


export const markerKey = (id: string) => `${markerPrefix}${id}`;


export const userInfoSchema = z.object({
  avatar: z.string(),
  name: z.string(),
  color: z.string(),
});



export const markerStateSchema = z.object({
  id: z.string(),
  position: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  overID: z.string(),
  selectedID: z.string(),
  userInfo: userInfoSchema,
});

export type UserInfo = z.TypeOf<typeof userInfoSchema>;
export type markerState = z.TypeOf<typeof markerStateSchema>;

export const markerStatePrefix = `markerState-`;
export const markerStateKey = (id: string) => `${markerStatePrefix}${id}`;
const markerStateValueSchema = markerStateSchema.omit({ id: true });



export async function getMarkerState(
  tx: ReadTransaction,
  id: string
): Promise<markerState> {
  const val = await tx.get(markerStateKey(id));
  if (val === undefined) {
    throw new Error("Expected markerState to be initialized already: " + id);
  }
  return {
    id,
    ...markerStateValueSchema.parse(val),
  };
}

export const markerSchema = z.object({
  id: z.string(),
  // type: z.literal("rect"),
  lat: z.number(),
  lng: z.number(),
  // fill: z.string(),
  animate: z.boolean(),
});

export type Marker = z.TypeOf<typeof markerSchema>;

const markerValueSchema = markerSchema.omit({ id: true });


export async function getMarker(
  tx: ReadTransaction,
  id: string
): Promise<Marker | undefined> {
  const val = await tx.get(markerKey(id));
  if (val === undefined) {
    console.log(`Specified marker ${id} not found.`);
    return undefined;
  }
  return {
    id,
    ...markerValueSchema.parse(val),
  };
}

export async function putMarker(
  tx: WriteTransaction,
  marker: Marker
): Promise<void> {
  await tx.put(markerKey(marker.id), marker);
}

export async function deleteMarker(
  tx: WriteTransaction,
  id: string
): Promise<void> {
  await tx.del(markerKey(id));
}

export async function moveMarker(
  tx: WriteTransaction,
  {
    id,
    dx,
    dy,
    animate = true,
  }: { id: string; dx: number; dy: number; animate?: boolean }
): Promise<void> {
  const marker = await getMarker(tx, id);
  if (marker) {
    marker.lat += dx;
    marker.lng += dy;
    marker.animate = animate;
    await putMarker(tx, marker);
  }
}