import { ReadTransaction, WriteTransaction } from "replicache";
import { z } from "zod";

export const polygonPrefix = `polygon-`;


export const polygonKey = (id: string) => `${polygonPrefix}${id}`;
// export type PolygonState = z.TypeOf<typeof polygonStateSchema>;



export const userInfoSchema = z.object({
  avatar: z.string(),
  name: z.string(),
  color: z.string(),
});



// export const polygonStateSchema = z.object({
//   id: z.string(),
//   position: z.object({
//     lat: z.number(),
//     lng: z.number(),
//   }),
//   overID: z.string(),
//   selectedID: z.string(),
//   userInfo: userInfoSchema,
// });

export type UserInfo = z.TypeOf<typeof userInfoSchema>;
// export type polygonState = z.TypeOf<typeof polygonStateSchema>;

export const markerStatePrefix = `markerState-`;
export const markerStateKey = (id: string) => `${markerStatePrefix}${id}`;
// const markerStateValueSchema = polygonStateSchema.omit({ id: true });



// export async function getMarkerState(
//   tx: ReadTransaction,
//   id: string
// ): Promise<polygonState> {
//   const val = await tx.get(markerStateKey(id));
//   if (val === undefined) {
//     throw new Error("Expected markerState to be initialized already: " + id);
//   }
//   return {
//     id,
//     ...markerStateValueSchema.parse(val),
//   };
// }

// export async function putMarkerState(
//   tx: WriteTransaction,
//   markerState: MarkerState
// ): Promise<void> {
//   await tx.put(markerStateKey(markerState.id), markerState);
// }


export const polygonSchema = z.object({
  id: z.string(),
path:z.array( z.object({
    lat: z.number(),
    lng: z.number(),
  })),
  animate: z.boolean(),
});

export type Polygon = z.TypeOf<typeof polygonSchema>;

const polygonValueSchema = polygonSchema.omit({ id: true });


export async function getPolygon(
  tx: ReadTransaction,
  id: string
): Promise<Polygon | undefined> {
  const val = await tx.get(polygonKey(id));
  console.log(id)
  if (val === undefined) {
    console.log(`Specified polygon ${id} not found.`);
    return undefined;
  }
  return {
    id,
    ...polygonValueSchema.parse(val),
  };
}

// export async function putMarker(
//   tx: WriteTransaction,
//   marker: Polygon
// ): Promise<void> {
//   await tx.put(polygonKey(marker.id), marker);
// }

// export async function deleteMarker(
//   tx: WriteTransaction,
//   id: string
// ): Promise<void> {
//   await tx.del(polygonKey(id));
// }

// export async function setMarker(
//   tx: WriteTransaction,
//   { id, lat, lng }: { id: string; lat: number; lng: number }
// ): Promise<void> {
//   const clientState = await getMarkerState(tx, id);
//   clientState.position.lat = lat;
//   clientState.position.lng = lng;
//   await putPolygonState(tx, clientState);
// }

// export async function moveMarker(
//   tx: WriteTransaction,
//   {
//     id,
//     lat,
//     lng,
//     animate = true,
//   }: { id: string; lat: number; lng: number; animate?: boolean }
// ): Promise<void> {
//   const marker = await getMarker(tx, id);
//   if (marker) {
//     marker.lat = lat;
//     marker.lng  = lng;
//     marker.animate = animate;
//     await putMarker(tx, marker);
//   }
// }