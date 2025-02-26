export const CATEGORY_MAPPING = {
  SCENE_OPEN: "open_scene",
  SCENE_CLOSED: "closed_scene",
  OBJ_OPAQUE: "opaque_obj",
  OBJ_TRANSPARENT: "transparent_obj",
};

const { SCENE_OPEN, SCENE_CLOSED, OBJ_OPAQUE, OBJ_TRANSPARENT } =
  CATEGORY_MAPPING;

export const SCENE_MAPPING = {
  [SCENE_OPEN]: {
    key: SCENE_OPEN,
    label: "Escena abierta",
  },
  [SCENE_CLOSED]: {
    key: SCENE_CLOSED,
    label: "Escena cerrada",
  },
};

export const OBJECT_MAPPING = {
  [OBJ_OPAQUE]: {
    key: OBJ_OPAQUE,
    label: "Objeto opaco",
  },
  [OBJ_TRANSPARENT]: {
    key: OBJ_TRANSPARENT,
    label: "Objeto transparente",
  },
};
