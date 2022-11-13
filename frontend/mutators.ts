import {
  initClientState, overShape,
  selectShape, setCursor
} from "./client-state";
import {
  deleteShape, initShapes, moveShape, putShape, resizeShape,
  rotateShape
} from "./shape";

import { deleteMarker, moveMarker, putMarker } from "./marker";

export type M = typeof mutators;

export const mutators = {
  createShape: putShape,
  deleteShape,
  moveShape,
  resizeShape,
  rotateShape,
  initClientState,
  setCursor,
  overShape,
  selectShape,
  initShapes,
  createMarker: putMarker,
  moveMarker,
  deleteMarker,
};
