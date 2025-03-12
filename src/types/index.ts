import {
  categoryKeys,
  metricsKeys,
  modelMetricsKeys,
  OBJ_COMPLEX,
  OBJ_OPAQUE,
  OBJ_TRANSPARENT,
  preprocesingMetricsKeys,
  SCENE_CLOSED,
  SCENE_OPEN,
} from "@/constants";

export type Categories = {
  [K in (typeof categoryKeys)[number]]?: string;
};

// Tag Types
export type TagEsc = typeof SCENE_OPEN | typeof SCENE_CLOSED;
export type TagObj =
  | typeof OBJ_OPAQUE
  | typeof OBJ_TRANSPARENT
  | typeof OBJ_COMPLEX;

export type SceneType = TagEsc | TagObj;

// Metrics Type
export type ModelMetrics = {
  [K in (typeof modelMetricsKeys)[number]]?: number;
};

export type PreprocessorMetrics = {
  [K in (typeof preprocesingMetricsKeys)[number]]?: number;
};

export type Metrics = {
  [K in (typeof metricsKeys)[number]]?: number;
};

// Other Types
export type FileType = "image" | "video";
export type ModelType = "NeRF" | "Gaussian";
export type PreprocessorType = "COLMAP" | "HLOC";

export type DataItem = Metrics & {
  id: number;
  title: string;
  scene_type: string;
  dataset: string;
  type: FileType;
  model: ModelType;
  preprocessor: PreprocessorType;
  virtual_scene: boolean;
  real_scene: boolean;
  date_added: Date;
  date_updated: Date;
};

export type DataItemRequest = DataItem & {
  opaque_obj: boolean;
  transparent_obj: boolean;
  complex_obj: boolean;
  open_scene: boolean;
  closed_scene: boolean;
  preprocessed?: boolean;
  trained?: boolean;
  evaluated?: boolean;
  successful?: boolean;
  error?: string;
  raw_data?: object;
};

export type DataItemTable = DataItem & {
  tag_obj: TagObj[];
  tag_esc: TagEsc[];
};

export type Request = {
  items: DataItemRequest[];
  total: number;
};
export { metricsKeys };

