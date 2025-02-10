import { ReactElement } from "react";
import { GraphNode, GraphNodeType } from "./-@interface";
import { hexToRgba } from "@/helpers/css/hex-to-rgba";
import { motion } from "framer-motion";
import { getCssVariable } from "@/helpers/css/get-css-variable";

export const SelectedContact = ({
  selectedContact,
}: {
  selectedContact: GraphNode;
}) => {
  if (selectedContact.type === GraphNodeType.DIALOG) {
    return (
      <Wrapper>
        <div className="flex items-center py-2 px-4 gap-4">
          <img
            loading="lazy"
            src={`https://t.me/i/userpic/320/${selectedContact.username}.svg`}
            className="h-12 w-12 rounded-full"
            decoding="async"
            alt=""
          />
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium">
              {selectedContact.firstName}
            </span>
            <span className="text-link text-xs font-normal">
              @{selectedContact.username}
            </span>
          </div>
        </div>
      </Wrapper>
    );
  }
};

const Wrapper = ({ children }: { children: ReactElement }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
      animate={{ opacity: 1, y: 0, filter: "unset" }}
      exit={{ opacity: 0, y: 10, filter: "blur(2px)" }}
      transition={{ duration: 0.15 }}
    >
      <div>
        <div className="p-4 pt-2">
          <div
            className="bg-secondary rounded-xl"
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
