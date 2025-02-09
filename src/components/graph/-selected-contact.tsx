import { ReactElement } from "react";
import { GraphNode, GraphNodeType } from "./-@interface";
import { hexToRgba } from "@/helpers/css/hex-to-rgba";
import { motion } from "framer-motion";
import Dialog from "@/ui/Dialog";

export const SelectedContact = ({
  selectedContact,
}: {
  selectedContact: GraphNode;
}) => {
  if (selectedContact.type === GraphNodeType.DIALOG) {
    return (
      <Wrapper>
        <Dialog
          name={selectedContact.firstName}
          username={selectedContact.username}
        />
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
        <div className="w-screen p-4 pt-2">
          <div
            className="bg-secondary rounded-xl"
            style={{
              boxShadow: `${hexToRgba("#6ab3f3", 0.8)} 0px 3px 0px 0px`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
