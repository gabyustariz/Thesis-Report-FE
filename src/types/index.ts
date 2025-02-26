// Constants
export const SCENE_OPEN = "open";
export const SCENE_CLOSED = "closed";
export const OBJ_OPAQUE = "opaque";
export const OBJ_TRANSPARENT = "transparent";

// Tag Types
export type TagEsc = typeof SCENE_OPEN | typeof SCENE_CLOSED;
export type TagObj = typeof OBJ_OPAQUE | typeof OBJ_TRANSPARENT;

// Metrics Keys
export const metricsKeys = [
  "psnr",
  "psnr_std",
  "ssim",
  "ssim_std",
  "lpips",
  "lpips_std",
  "preprocesing_time_s",
  "training_time_s",
  "evaluation_time_s",
  "num_rays_per_sec",
  "num_rays_per_sec_std",
  "fps",
  "fps_std",
  "frames_quantity",
  "frame_size_total_bytes",
  "frame_size_avg_bytes",
] as const;

// Metrics Type
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
  open_scene: boolean;
  closed_scene: boolean;
  preprocessed: boolean;
  trained: boolean;
  evaluated: boolean;
  successful: boolean;
  error: string;
  raw_data: object;
};

export type DataItemTable = DataItem & {
  tag_obj: TagObj[];
  tag_esc: TagEsc[];
};

export type Request = {
  items: DataItemRequest[];
  total: number;
}
