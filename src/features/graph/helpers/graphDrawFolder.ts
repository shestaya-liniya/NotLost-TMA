import { getCssVariable } from "@/helpers/css/getCssVariable";
import { hexToRgba } from "@/helpers/css/hexToRgba";
import { NodeObject } from "react-force-graph-2d";

export const drawTopicNode = (
  node: NodeObject,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  isMacOrIos: boolean
) => {
  const titleText = node.title!.toString();

  // circle
  const radius = 5;
  const usernameFontSize = radius;

  const primaryColor = getCssVariable("--color-primary");
  const secondaryColor = getCssVariable("--color-secondary");
  const linkColor = getCssVariable("--color-link");

  ctx.beginPath();
  ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = hexToRgba(primaryColor, 1);
  ctx.fill();

  // circle stroke
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = hexToRgba(secondaryColor, 1);
  ctx.stroke();

  // topic title
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = `400 ${usernameFontSize}px Sans-Serif`;

  const textWidth = ctx.measureText(titleText).width;
  const textHeight = usernameFontSize;

  // text background
  const padding = 1;
  const cornerRadius = 3;
  ctx.fillStyle = hexToRgba(primaryColor, 1);

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

  // border
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = hexToRgba(secondaryColor, 1);
  ctx.stroke();

  ctx.fillStyle = hexToRgba(linkColor, 1);

  // on ios / mac os text is lower than should be
  if (isMacOrIos) {
    ctx.fillText(titleText, node.x!, node.y! + radius + 1);
  } else {
    ctx.fillText(titleText, node.x!, node.y! + radius + 2);
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
