import { getMiniAppTopInset } from "@/helpers/css/get-top-tg-inset";
import { IGraphNodeDialog } from "../Graph.interface";
import { motion } from "framer-motion";
import Tappable from "@/ui/Tappable";
import getTelegramAvatarLink from "@/helpers/telegram/getTelegramAvatarLink";
import { getCssVariable } from "@/helpers/css/get-css-variable";
import { hexToRgba } from "@/helpers/css/hex-to-rgba";
import { ReactElement } from "react";

export default function Graphdialog(props: { dialog: IGraphNodeDialog }) {
  const { dialog } = props;
  return (
    <Wrapper>
      <Tappable
        className="flex items-center py-2 px-4 gap-4"
        onClick={() => {
          window.open(`https://t.me/${dialog.username}`);
        }}
      >
        <img
          loading="lazy"
          src={getTelegramAvatarLink(dialog.username)}
          className="h-12 w-12 rounded-full"
          decoding="async"
          alt=""
        />
        <div className="flex flex-col">
          <span className="text-white text-sm font-medium">
            {dialog.firstName}
          </span>
          <span className="text-link text-xs font-normal">
            @{dialog.username}
          </span>
        </div>
      </Tappable>
    </Wrapper>
  );
}

const Wrapper = ({ children }: { children: ReactElement }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
      animate={{ opacity: 1, y: 0, filter: "unset" }}
      exit={{ opacity: 0, y: 10, filter: "blur(2px)" }}
      transition={{ duration: 0.15 }}
      style={{
        top: getMiniAppTopInset(),
      }}
      className="absolute left-0 z-10 w-full"
    >
      <div>
        <div className="p-4 pt-2">
          <div
            className="bg-primary rounded-xl"
            style={{
              boxShadow: `${hexToRgba(getCssVariable("--color-link"), 0.8)} 0px 3px 0px 0px`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
