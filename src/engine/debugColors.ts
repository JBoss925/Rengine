export const DEFAULT_WIREFRAME_COLORS: WireframeColors = {
  anchor: "#ff5b6f",
  position: "#f4d35e",
  relationship: "#141414"
};

export function getWireframeColors(config?: GlobalConfig): WireframeColors {
  return {
    ...DEFAULT_WIREFRAME_COLORS,
    ...(config?.wireframeColors ?? {})
  };
}
