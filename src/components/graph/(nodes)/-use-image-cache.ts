import { useState } from "react";
import { GraphNode, GraphNodeImageCache, GraphNodeType } from "../-@interface";
import { NodeObject } from "react-force-graph-2d";
import tagIcon from "@/assets/icons/graph/tag.svg";
import { getCssVariable } from "@/helpers/css/get-css-variable";

export const useImageCache = (nodes: GraphNode[]) => {
  const [imageCache, setImageCache] = useState<GraphNodeImageCache>({});

  const loadImage = (url: string) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });

  const fetchImages = async () => {
    const imageLoadPromises = nodes.map(async (node) => {
      if (!imageCache[node.id]) {
        try {
          let img: HTMLImageElement | null = null;

          switch (node.type) {
            case GraphNodeType.DIALOG:
              img = (await loadImage(
                `https://t.me/i/userpic/320/${node.username}.svg`
              )) as HTMLImageElement;
              break;

            case GraphNodeType.TOPIC:
              const svgString = `
    <svg fill="${getCssVariable("--color-link")}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20,6H13.41L11,3.59A2,2,0,0,0,9.59,3H4A2,2,0,0,0,2,5V19a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V8A2,2,0,0,0,20,6Z"></path>
    </svg>`;

              // Convert to a Data URL
              const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
              const svgUrl = URL.createObjectURL(svgBlob);

              img = (await loadImage(svgUrl)) as HTMLImageElement;
              break;

            case GraphNodeType.TAG:
              img = (await loadImage(tagIcon)) as HTMLImageElement;
              break;
          }

          if (img) {
            setImageCache((prev) => ({
              ...prev,
              [node.id]: img,
            }));
          }
        } catch (error) {
          console.error(`Error loading image for node ${node.id}:`, error);
        }
      }
    });

    await Promise.all(imageLoadPromises);
  };

  const addStaticImage = async (url: string, node: NodeObject) => {
    try {
      const img = await loadImage(url);
      setImageCache((prev) => ({
        ...prev,
        [node.id!]: img as HTMLImageElement,
      }));
    } catch (error) {
      console.error(`Error loading image for node ${node.id}:`, error);
    }
  };

  return {
    imageCache,
    fetchImages,
    addStaticImage,
  };
};
