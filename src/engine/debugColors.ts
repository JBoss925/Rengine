export const DEFAULT_WIREFRAME_COLORS: WireframeColors = {
  anchor: "#ff5b6f",
  position: "#3f9dff",
  relationship: "#141414"
};

export function getWireframeColors(config?: GlobalConfig): WireframeColors {
  return {
    ...DEFAULT_WIREFRAME_COLORS,
    ...(config?.wireframeColors ?? {})
  };
}
