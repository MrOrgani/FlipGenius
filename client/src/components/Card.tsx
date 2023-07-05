import {
  useMotionValue,
  useAnimation,
  motion,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

const Card = ({
  style,
  onVote,
  datum: { word, definition, successRate },
  ...props
}) => {
  const cardElem = useRef(null);

  const x = useMotionValue(0);
  const controls = useAnimation();
  const xInput = [-300, 0, 300];
  const color = useTransform(x, xInput, [
    "linear-gradient(120deg, #ff008c 0%, rgb(211, 9, 225) 100%)",
    "linear-gradient(120deg, #7700ff 0%, rgb(68, 0, 255) 100%)",
    "linear-gradient(120deg, rgb(230, 255, 0) 0%, rgb(3, 209, 0) 100%)",
  ]);
  const rotate = useTransform(x, xInput, [-35, 0, 35]);

  const [constrained, setConstrained] = useState(true);

  const [direction, setDirection] = useState();

  const [velocity, setVelocity] = useState();

  const [isActive, setIsActive] = useState(false);

  const getVote = (childNode, parentNode) => {
    const childRect = childNode.getBoundingClientRect();
    const parentRect = parentNode.getBoundingClientRect();
    let result =
      parentRect.left >= childRect.right
        ? false
        : parentRect.right <= childRect.left
        ? true
        : undefined;
    return result;
  };

  // determine direction of swipe based on velocity
  const getDirection = () => {
    return velocity >= 1 ? "right" : velocity <= -1 ? "left" : undefined;
  };

  const getTrajectory = () => {
    setVelocity(x.getVelocity());
    setDirection(getDirection());
  };

  const flyAway = (min) => {
    const flyAwayDistance = (direction: string) => {
      const parentWidth =
        cardElem.current.parentNode.getBoundingClientRect().width;
      const childWidth = cardElem.current.getBoundingClientRect().width;
      return direction === "left"
        ? -parentWidth / 2 - childWidth / 2
        : parentWidth / 2 + childWidth / 2;
    };

    if (direction && Math.abs(velocity) > min) {
      setConstrained(false);
      controls.start({
        x: flyAwayDistance(direction),
      });
    }
  };

  useEffect(() => {
    const unsubscribeX = x.onChange(() => {
      if (cardElem.current) {
        const childNode = cardElem.current;
        const parentNode = cardElem.current.parentNode;
        const result = getVote(childNode, parentNode);
        result !== undefined && onVote(result);
      }
    });

    return () => unsubscribeX();
  });

  return (
    <motion.div
      onClick={() => setIsActive(!isActive)}
      animate={{ ...controls, rotateY: isActive ? 180 : 0 }}
      dragConstraints={constrained && { left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={1}
      ref={cardElem}
      className="flex h-full w-full items-center justify-center "
      style={{
        x,
        position: "absolute",
        rotate,
        background: color,
        width: "400px",
        height: "250px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",
        boxShadow: `0 0 2px rgba(0, 0, 0, 0.15)`,
        borderRadius: "8px",
        top: 0,
        color: "white",
      }}
      onDrag={getTrajectory}
      onDragEnd={() => flyAway(500)}
      whileTap={{ scale: 1.1 }}
      {...props}
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
              <motion.div>{definition}</motion.div>
            ) : (
              <div className={"text-3xl"}>{word}</div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default Card;
