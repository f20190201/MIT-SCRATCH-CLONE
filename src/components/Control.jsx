import React, { useState } from "react";
import Button from "./Buttons/Button";
import { Draggable, Droppable } from "react-beautiful-dnd";

const Control = ({dropArray, setDropArray, buttonsArray = [], droppableIdName, handleButtonCallback = () => {}, commandValueRef, selectedSprite, isSource}) => {

  const buttonsArrayCopy = [...buttonsArray];

  return (
    <Droppable droppableId={droppableIdName} type="group">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-4 ml-2 mt-2 min-h-[90vh]">
          {buttonsArrayCopy.map((button, index) => (
            <Draggable key={button.id+"_"+droppableIdName+index} draggableId={button.id+"_"+droppableIdName+index} index={index}>
              {(provided) => (
                <Button
                  isSource={isSource}
                  provided={provided}
                  dropArray={dropArray}
                  setDropArray={setDropArray}
                  index={index}
                  {...button}
                  onClickCallback={handleButtonCallback}
                  commandValueRef={commandValueRef}
                  selectedSprite={selectedSprite}
                  
                  
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

export default Control;
