export default function getTextWidth(
  text: string,
  font: string = "14px Arial"
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx!.font = font;
  return ctx!.measureText(text).width;
}
