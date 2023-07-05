import { motion, AnimatePresence } from "framer-motion";
import React from "react";

const FlipCard = ({ style, word, definition }) => {
  const [isActive, setIsActive] = React.useState(false);

  return (
    <motion.div
      onClick={() => setIsActive(!isActive)}
      animate={{
        rotateY: isActive ? 180 : 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="flex h-full w-full items-center justify-center "
      style={style}
    >
      <AnimatePresence>
        <motion.div
          key={word}
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="container">
            {isActive ? (
              <motion.div style={{ transform: `rotateY(180deg)` }}>
                {definition}
              </motion.div>
            ) : (
              <div className={"text-3xl"}>{word}</div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default FlipCard;
