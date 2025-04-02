import { NodeObject } from "react-force-graph-2d";
import { hexToRgba } from "@/helpers/css/hex-to-rgba";
import { getCssVariable } from "@/helpers/css/get-css-variable";
import { truncateWord } from "@/helpers/truncate-word";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

export const graphDrawDialog = (
  node: NodeObject,
  ctx: CanvasRenderingContext2D,
  globalScale: number,
  img: HTMLImageElement | null
) => {
  const IMG_SIZE = 10;
  const FONT_SIZE = 2;

  const lp = retrieveLaunchParams();

  ctx.font = `400 ${FONT_SIZE}px Sans-Serif`;

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
  const textWidth = ctx.measureText(truncateWord(node.firstName, 6)).width;
  const textHeight = FONT_SIZE;

  // text background
  const padding = 0.6;
  const cornerRadius = 1.6;

  ctx.fillStyle = hexToRgba(getCssVariable("--color-primary"), textOpacity);
  ctx.beginPath();

  const x = node.x! - textWidth / 2 - padding * 2;
  const y = node.y! + IMG_SIZE - padding - 6.5;
  const width = textWidth + padding * 4;
  const height = textHeight + padding * 2;

  ctx.moveTo(x + cornerRadius, y);
  ctx.arcTo(x + width, y, x + width, y + height, cornerRadius);
  ctx.arcTo(x + width, y + height, x, y + height, cornerRadius);
  ctx.arcTo(x, y + height, x, y, cornerRadius);
  ctx.arcTo(x, y, x + width, y, cornerRadius);
  ctx.closePath();
  ctx.fill();

  // text background border
  ctx.lineWidth = 0.25;
  ctx.strokeStyle = hexToRgba(getCssVariable("--color-secondary"), 1);
  ctx.stroke();

  drawText(
    `${truncateWord(node.firstName, 6)}`,
    FONT_SIZE,
    getCssVariable("--color-link"),
    lp.tgWebAppPlatform === "ios" ? IMG_SIZE / 4 - 0.25 : IMG_SIZE / 4 + 1
  );

  const drawAvatar = (image: HTMLImageElement | null) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, IMG_SIZE / 4, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.clip();

    if (image) {
      ctx.drawImage(
        image,
        node.x! - IMG_SIZE / 4,
        node.y! - IMG_SIZE / 4,
        IMG_SIZE / 2,
        IMG_SIZE / 2
      );
    }

    // blue border around node
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, IMG_SIZE / 4, 0, 2 * Math.PI, false);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = getCssVariable("--color-link");
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  };

  drawAvatar(img);
};
