import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Card from "./Card";

// return new array with last item removed
const pop = (array) => {
  return array.filter((_, index) => {
    return index < array.length - 1;
  });
};

const CardStack = React.forwardRef(
  ({ onVote, asCards, ...props }, cardsRef) => {
    const [stack, setStack] = useState(asCards);

    const { userInfo } = useSelector((state) => state.auth);
    const { collectionId } = useParams<"collectionId">();

    const handleVote = (item, isKnown) => {
      const [word, { definition, successRate }] = item;
      // update the stack
      cardsRef.current = [
        ...cardsRef.current,
        [
          word,
          {
            definition,
            successRate: isKnown
              ? successRate + 20
              : Math.max(successRate - 10, 0),
          },
        ],
      ];
      let newStack = pop(stack);
      setStack(newStack);

      console.log("item", item, cardsRef.current);
      // run function from onVote prop, passing the current item and value of vote
      onVote(item, isKnown);
    };

    useEffect(() => {
      if (cardsRef.current.length === 5) {
        console.log("WE SEND DATA TO THE BACK", cardsRef.current);
        const updateWordListSuccessRate = async () => {
          await axios.put(
            `http://localhost:8800/api/collections/${collectionId}`,
            JSON.stringify({
              authorId: userInfo.id,
              wordList: JSON.stringify(cardsRef.current),
            }),
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );

          // console.log("DATA TO SEND TO THE BACK ", {
          //   authorId: userInfo.id,
          //   wordList: JSON.stringify(cardsRef.current),
          // });
        };
        updateWordListSuccessRate();
      }
    }, [cardsRef.current]);

    return (
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",

            width: "400px",
          }}
          {...props}
        >
          {stack.map((item, index) => {
            let isTop = index === stack.length - 1;
            const [word, { definition, successRate }] = item;
            return (
              <Card
                drag={isTop} // Only top card is draggable
                key={item.key || index}
                onVote={(result) => handleVote(item, result)}
                datum={{ word, definition, successRate }}
                style={{}}
              />
            );
          })}
        </div>
      </div>
    );
  }
);

export default CardStack;
