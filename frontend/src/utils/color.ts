export function jetColorMap(n: number) {
  const jet = []
  for (let i = 0; i < n; i++) {
    let r, g, b
    const t = i / (n - 1)
    if (t < 0.125) {
      r = 0
      g = 0
      b = 1 + 8 * t
    } else if (t < 0.375) {
      r = 0
      g = 4 * t - 1
      b = 1
    } else if (t < 0.625) {
      r = 4 * t - 2
      g = 1
      b = 1 - 4 * t + 2
    } else if (t < 0.875) {
      r = 1
      g = 1 - 4 * t + 3
      b = 0
    } else {
      r = 1
      g = 0
      b = 0
    }
    jet.push(
      `#${Math.floor(r * 255)
        .toString(16)
        .padStart(2, "0")}${Math.floor(g * 255)
        .toString(16)
        .padStart(2, "0")}${Math.floor(b * 255)
        .toString(16)
        .padStart(2, "0")}`,
    )
  }

  return jet
}
