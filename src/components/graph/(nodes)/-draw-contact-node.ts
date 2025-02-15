import { NodeObject } from "react-force-graph-2d";
import { getTopicRadius } from "./-draw-topic-node";
import { hexToRgba } from "@/helpers/css/hex-to-rgba";
import { getCssVariable } from "@/helpers/css/get-css-variable";

export const drawContactNode = (
  node: NodeObject,
  ctx: CanvasRenderingContext2D,
  globalScale: number,
  img: HTMLImageElement | null,
  platform: string
) => {
  const imgSize = 10;

  if (getTopicRadius(globalScale) >= 36) return;

  //const firstNameFontSize = Math.min(2, (12 * globalScale) / 8);
  const usernameFontSize = Math.min(2, (12 * globalScale) / 8);

  ctx.font = `400 ${usernameFontSize}px Sans-Serif`;

  let textOpacity = Math.min(globalScale / 4, 1);

  if (globalScale < 4) {
    textOpacity = globalScale / 10;
  }

  if (globalScale < 2) {
    textOpacity = 0;
  }

  const drawText = (
    text: string,
    fontSize: number,
    color: string,
    yOffset: number
  ) => {
    ctx.font = `400 ${fontSize}px Sans-Serif`;
    ctx.fillStyle = hexToRgba(color, textOpacity);
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(text, node.x!, node.y! + yOffset);
  };

  // first name
  /* drawText(
    node.firstName.toString(),
    firstNameFontSize,
    getCssVariable("--tg-theme-text-color"),
    imgSize / 4 + 1
  ); */

  // username
  const textWidth = ctx.measureText(node.firstName).width;
  const textHeight = usernameFontSize;

  // text background
  const padding = 0.6;
  const cornerRadius = 1.6;
  ctx.fillStyle = hexToRgba(getCssVariable("--color-primary"), textOpacity);

  ctx.beginPath();
  const x = node.x! - textWidth / 2 - padding * 2;
  const y = node.y! + imgSize - padding - 6.5;
  const width = textWidth + padding * 4;
  const height = textHeight + padding * 2;

  ctx.moveTo(x + cornerRadius, y);
  ctx.arcTo(x + width, y, x + width, y + height, cornerRadius);
  ctx.arcTo(x + width, y + height, x, y + height, cornerRadius);
  ctx.arcTo(x, y + height, x, y, cornerRadius);
  ctx.arcTo(x, y, x + width, y, cornerRadius);
  ctx.closePath();
  ctx.fill();
  // border
  ctx.lineWidth = 0.25; // Set the border width
  ctx.strokeStyle = hexToRgba(getCssVariable("--color-secondary"), 1); // Set the border color
  ctx.stroke();

  drawText(
    `${node.firstName!}`,
    usernameFontSize,
    getCssVariable("--color-link"),
    platform === "ios" ? imgSize / 4 + 0.5 : imgSize / 4 + 1
  );

  const drawAvatar = (image: HTMLImageElement | null) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, imgSize / 4, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.clip();

    if (image) {
      ctx.drawImage(
        image,
        node.x! - imgSize / 4,
        node.y! - imgSize / 4,
        imgSize / 2,
        imgSize / 2
      );
    } /* else {
      // acronym
      const acronymFontSize = Math.min(4, (12 * globalScale) / 8);
      const acronym = node.firstName[0];

      ctx.font = `600 ${acronymFontSize}px Sans-Serif`;
      ctx.fillStyle = hexToRgba(getCssVariable("--tg-theme-link-color"), 1);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(acronym, node.x!, node.y!);

      // acronym bg
      ctx.fillStyle = "rgba(41, 144, 255, .15)";
      ctx.fill();
    } */

    // blue border around node
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, imgSize / 4, 0, 2 * Math.PI, false);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = getCssVariable("--color-link");
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  };

  drawAvatar(img);
};
