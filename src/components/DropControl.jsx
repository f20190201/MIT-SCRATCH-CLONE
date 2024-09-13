import React, { useState } from "react";
import Button from "./Buttons/Button";
import { Draggable, Droppable } from "react-beautiful-dnd";

const DropControl = ({buttonsArray = [], droppableIdName}) => {
  const handleButtonCallback = (id, inputValue, goToCoordinates) => {
  };

//   const buttonsArray = [
//     {
//       leftText: "Move X",
//       rightText: "Steps",
//       id: "moveX",
//     },
//     {
//       leftText: "Move Y",
//       rightText: "Steps",
//       id: "moveY",
//     },
//     {
//       leftText: "Turn Clockwise",
//       rightText: "Degrees",
//       id: "rotateClock",
//     },
//     {
//       leftText: "Turn Anticlockwise",
//       rightText: "Degrees",
//       id: "rotateAnticlock",
//     },
//     { id: "goto" },
//   ];

  return (
    <Droppable droppableId={droppableIdName} type="group">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-4 ml-2 mt-2">
          {buttonsArray.map((button, index) => (
            <Draggable key={button.id} draggableId={button.id} index={index}>
              {(provided) => (
                <Button
                  provided={provided}
                  {...button}
                  onClickCallback={handleButtonCallback}
                />
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default DropControl;
