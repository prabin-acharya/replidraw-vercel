import { Replicache } from "replicache";
import { useSubscribe } from "replicache-react";
import { clientStatePrefix, getClientState } from "./client-state";
import { getMarker, markerPrefix } from "./marker";
import { mutators } from "./mutators";
import { getShape, shapePrefix } from "./shape";

export function useShapeIDs(rep: Replicache<typeof mutators>) {
  return useSubscribe(
    rep,
    async (tx) => {
      const shapes = await tx.scan({ prefix: shapePrefix }).keys().toArray();
      return shapes.map((k) => k.split("-", 2)[1]);
    },
    []
  );
}

export function useMarkerIDs(rep: Replicache<typeof mutators>) {
  return useSubscribe(
    rep,
    async (tx) => {
      const markers = await tx.scan({ prefix: markerPrefix }).keys().toArray();
      return markers.map((k) => k.split("-", 2)[1]);
    },
    []
  );
}


export function useShapeByID(rep: Replicache<typeof mutators>, id: string) {
  return useSubscribe(
    rep,
    async (tx) => {
      return (await getShape(tx, id)) ?? null;
    },
    null
  );
}

export function useMarkerByID(rep: Replicache<typeof mutators>, id: string) {
  return useSubscribe(
    rep,
    async (tx) => {
      return (await getMarker(tx, id)) ?? null;
    },
    null
  );
}

export function useUserInfo(rep: Replicache<typeof mutators>) {
  return useSubscribe(
    rep,
    async (tx) => {
      return (await getClientState(tx, await rep.clientID)).userInfo;
    },
    null
  );
}


export function useOverShapeID(rep: Replicache<typeof mutators>) {
  return useSubscribe(
    rep,
    async (tx) => {
      return (await getClientState(tx, await rep.clientID)).overID;
    },
    ""
  );
}

export function useSelectedShapeID(rep: Replicache<typeof mutators>) {
  return useSubscribe(
    rep,
    async (tx) => {
      return (await getClientState(tx, await rep.clientID)).selectedID;
    },
    ""
  );
}

export function useSelectedMarkerID(rep: Replicache<typeof mutators>) {
  return useSubscribe(
    rep,
    async (tx) => {
      return (await getClientState(tx, await rep.clientID)).selectedID;
    },
    ""
  );
}

export function useCollaboratorIDs(rep: Replicache<typeof mutators>) {
  return useSubscribe(
    rep,
    async (tx) => {
      const clientIDs = await tx
        .scan({ prefix: clientStatePrefix })
        .keys()
        .toArray();
      const myClientID = await rep.clientID;
      return clientIDs
        .filter((k) => !k.endsWith(myClientID))
        .map((k) => k.substr(clientStatePrefix.length));
    },
    []
  );
}

export function useClientInfo(
  rep: Replicache<typeof mutators>,
  clientID: string
) {
  return useSubscribe(
    rep,
    async (tx) => {
      return await getClientState(tx, clientID);
    },
    null
  );
}
