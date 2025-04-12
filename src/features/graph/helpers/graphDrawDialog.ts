import { NodeObject } from "react-force-graph-2d";
import { getCssVariable } from "@/helpers/css/getCssVariable";
import { hexToRgba } from "@/helpers/css/hexToRgba";
import { truncateWord } from "@/helpers/truncateWord";

export const drawContactNode = (
  node: NodeObject,
  ctx: CanvasRenderingContext2D,
  globalScale: number,
  img: HTMLImageElement | null,
  isIos: boolean,
  isMac: boolean
) => {
  const AVATAR_SIZE = 10;

  const firstNameFontSize = Math.min(2, (12 * globalScale) / 8);
  let textOpacity = Math.min(globalScale / 4, 1);

  if (globalScale < 4) {
    textOpacity = globalScale / 10;
  }

  if (globalScale < 2) {
    textOpacity = 0;
  }

  const primaryColor = getCssVariable("--color-primary");
  const secondaryColor = getCssVariable("--color-secondary");
  const linkColor = getCssVariable("--color-link");

  ctx.font = `400 ${firstNameFontSize}px Sans-Serif`;

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

  // firstName
  const textWidth = ctx.measureText(truncateWord(node.firstName, 6)).width;
  const textHeight = firstNameFontSize;

  // text background
  const padding = 0.6;
  const cornerRadius = 1.6;
  ctx.fillStyle = hexToRgba(primaryColor, textOpacity);

  ctx.beginPath();
  const x = node.x! - textWidth / 2 - padding * 2;
  const y = node.y! + AVATAR_SIZE - padding - 6.5;
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
  ctx.lineWidth = 0.25;
  ctx.strokeStyle = hexToRgba(secondaryColor, 1);
  ctx.stroke();

  drawText(
    `${truncateWord(node.firstName!, 6)}`,
    firstNameFontSize,
    linkColor,
    isMac
      ? AVATAR_SIZE / 4 + 0.5
      : isIos
        ? AVATAR_SIZE / 4 - 0.25
        : AVATAR_SIZE / 4 + 1
  );

  const drawAvatar = (image: HTMLImageElement | null) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, AVATAR_SIZE / 4, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.clip();

    if (image) {
      ctx.drawImage(
        image,
        node.x! - AVATAR_SIZE / 4,
        node.y! - AVATAR_SIZE / 4,
        AVATAR_SIZE / 2,
        AVATAR_SIZE / 2
      );
    }

    // blue border around node
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, AVATAR_SIZE / 4, 0, 2 * Math.PI, false);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = getCssVariable("--color-link");
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  };

  drawAvatar(img);
};
