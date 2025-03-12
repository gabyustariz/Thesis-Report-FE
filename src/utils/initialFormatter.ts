import { OBJECT_MAPPING, SCENE_MAPPING } from "@/constants";
import { DataItemRequest, TagEsc, TagObj } from "@/types";

const getFormattedItems = (items: any[]) => {
  return items.map((item) => {
    const {
      opaque_obj,
      transparent_obj,
      complex_obj,
      open_scene,
      closed_scene,
      preprocessed,
      trained,
      evaluated,
      successful,
      error,
      raw_data,
      ...rest
    } = item;
    const tag_objs = !item.tag_objs
      ? Object.keys(OBJECT_MAPPING).filter(
          (i) => item[i as keyof DataItemRequest]
        )
      : ([] as TagObj[]);
    const tag_escs = !item.tag_escs
      ? Object.keys(SCENE_MAPPING).filter(
          (i) => item[i as keyof DataItemRequest]
        )
      : ([] as TagEsc[]);
    return {
      ...rest,
      tag_obj: tag_objs,
      tag_esc: tag_escs,
    };
  });
};

export default getFormattedItems;
