import React, { useState } from "react";
import Button from "./Buttons/Button";
import { Draggable, Droppable } from "react-beautiful-dnd";

const Control = ({dropArray, setDropArray, buttonsArray = [], droppableIdName, handleButtonCallback = () => {}, commandValueRef, selectedSprite, isSource, isDragging = false}) => {

  const buttonsArrayCopy = [...buttonsArray];

  return (
    <Droppable droppableId={droppableIdName} type="group">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps} className={`flex flex-col gap-4 m-2 min-h-[90vh] ${!isSource && isDragging && 'bg-gray-200 rounded-md border-dotted'}`}>
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
