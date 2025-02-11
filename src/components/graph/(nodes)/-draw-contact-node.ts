import { NodeObject } from "react-force-graph-2d";
import { getTopicRadius } from "./-draw-topic-node";
import { hexToRgba } from "@/helpers/css/hex-to-rgba";
import { getCssVariable } from "@/helpers/css/get-css-variable";

export const drawContactNode = (
  node: NodeObject,
  ctx: CanvasRenderingContext2D,
  globalScale: number,
  img: HTMLImageElement | null
) => {
  const imgSize = 10;

  if (getTopicRadius(globalScale) >= 36) return;

  //const firstNameFontSize = Math.min(2, (12 * globalScale) / 8);
  const usernameFontSize = Math.min(2, (12 * globalScale) / 8);

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
  drawText(
    `@${node.username!}`,
    usernameFontSize,
    getCssVariable("--color-white"),
    imgSize / 4 + 0.5
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
    } else {
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
    }

    // blue border around node
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, imgSize / 4, 0, 2 * Math.PI, false);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = getCssVariable("--tg-theme-accent-text-color");
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  };

  drawAvatar(img);
};
