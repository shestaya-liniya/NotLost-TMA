import { NodeObject } from "react-force-graph-2d";
import { hexToRgba } from "@/helpers/css/hexToRgba";
import { getCssVariable } from "@/helpers/css/getCssVariable";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

export const graphDrawFolder = (
  node: NodeObject,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement
) => {
  const FONT_SIZE = 5;

  const lp = retrieveLaunchParams();
  const title = node.title;

  // circle
  const radius = 5;

  ctx.beginPath();
  ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = hexToRgba(getCssVariable("--color-primary"), 1);
  ctx.fill();

  // circle stroke
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = hexToRgba(getCssVariable("--color-secondary"), 1);
  ctx.stroke();

  // topic title
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = `400 ${FONT_SIZE}px Sans-Serif`;

  const textWidth = ctx.measureText(title).width;
  const textHeight = FONT_SIZE;

  // text background
  const padding = 1;
  const cornerRadius = 3;
  ctx.fillStyle = hexToRgba(getCssVariable("--color-primary"), 1);

  ctx.beginPath();
  const x = node.x! - textWidth / 2 - padding * 2;
  const y = node.y! + (radius + 2) - padding;
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
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = hexToRgba(getCssVariable("--color-secondary"), 1);
  ctx.stroke();

  ctx.fillStyle = hexToRgba(getCssVariable("--color-link"), 1);

  // on ios / mac os text is lower than should be
  if (["macos", "ios"].includes(lp.tgWebAppPlatform)) {
    ctx.fillText(title, node.x!, node.y! + radius + 1);
  } else {
    ctx.fillText(title, node.x!, node.y! + radius + 2);
  }

  // icon
  if (img) {
    const imgSize = radius;

    ctx.save();
    ctx.drawImage(
      img,
      node.x! - imgSize / 2,
      node.y! - imgSize / 2,
      imgSize,
      imgSize
    );
    ctx.restore();
  }
};
