export const SCENE_OPEN = "open_scene";
export const SCENE_CLOSED = "closed_scene";
export const OBJ_OPAQUE = "opaque_obj";
export const OBJ_TRANSPARENT = "transparent_obj";
export const OBJ_COMPLEX = "complex_obj";

export const categoryKeys = [
  SCENE_OPEN,
  SCENE_CLOSED,
  OBJ_OPAQUE,
  OBJ_TRANSPARENT,
  OBJ_COMPLEX,
] as const;

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
  [OBJ_COMPLEX]: {
    key: OBJ_COMPLEX,
    label: "Objeto complejo",
  },
};

export const CATEGORY_MAPPING = {
  ...SCENE_MAPPING,
  ...OBJECT_MAPPING,
};

export const modelMetricsKeys = [
  "psnr",
  "ssim",
  "lpips",
  "training_time_s",
  "evaluation_time_s",
] as const;

export const preprocesingMetricsKeys = [
  "frames_match_ratio",
  "preprocesing_time_s",
] as const;

// Metrics Keys
export const metricsKeys = [
  ...modelMetricsKeys,
  ...preprocesingMetricsKeys,
  "psnr_std",
  "ssim_std",
  "lpips_std",
  "num_rays_per_sec",
  "num_rays_per_sec_std",
  "fps",
  "fps_std",
  "frames_total",
  "frames_training_total",
  "frame_size_total_bytes",
  "frame_size_avg_bytes",
] as const;

export const METRIC_MAPPING = {
  psnr: "PSNR",
  ssim: "SSIM",
  lpips: "LPIPS",
  training_time_s: "Tiempo de entrenamiento",
  evaluation_time_s: "Tiempo de evaluación",
  preprocesing_time_s: "Tiempo de preprocesamiento",
  frames_match_ratio: "Frames match ratio",
  psnr_std: "PSNR std",
  ssim_std: "SSIM std",
  lpips_std: "LPIPS std",
  num_rays_per_sec: "Num rays per sec",
  num_rays_per_sec_std: "Num rays per sec std",
  fps: "FPS",
  fps_std: "FPS std",
  frames_total: "Frames totales",
  frames_training_total: "Frames de entrenamiento",
  frame_size_total_bytes: "Tamaño total de frames (B)",
  frame_size_avg_bytes: "Tamaño promedio de frames (B)",
};

export const DATES_MAPPING = {
  date_added: "Fecha de creación",
  date_updated: "Fecha de actualización",
};

export const MORE_SCENES_MAPPING = {
  virtual_scene: "Escena virtual",
  real_scene: "Escena real",
};

export const SCENES_MAPPING = {
  opaque_obj: "Objeto opaco",
  transparent_obj: "Objeto transparente",
  complex_obj: "Objeto complejo",
  open_scene: "Escena abierta",
  closed_scene: "Escena cerrada",
};

export const TABLE_VISIBLE_MAPPING = {
  id: "ID",
  title: "Título de experimento",
  scene_type: "ID de escena",
  dataset: "Dataset",
  model: "Modelo de IA",
  preprocessor: "Preprocesador",
  tag_obj: "Tags de objetos",
  tag_esc: "Tags de escenas",
  type: "Tipo de formato",
  ...METRIC_MAPPING,
  ...MORE_SCENES_MAPPING,
  ...DATES_MAPPING,
};

export const TABLE_MAPPING = {
  ...TABLE_VISIBLE_MAPPING,
  ...SCENES_MAPPING,
};

export const METRIC_TABLES = [
  {
    key: "model",
    label: "Tabla de Métricas de Modelos",
    metrics: [...modelMetricsKeys],
    categoryKeys: [...categoryKeys],
  },
  {
    key: "preprocessor",
    label: "Tabla de Métricas de Preprocesadores",
    metrics: [...preprocesingMetricsKeys],
    categoryKeys: [...categoryKeys],
  },
];
