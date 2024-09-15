import React, { useState } from "react";

const Button = ({
  id = "",
  leftText = "Move X",
  rightText = "steps",
  onClickCallback,
  provided,
  value,
  commandValueRef,
  selectedSprite,
  isSource,
  dropArray,
  setDropArray,
  index
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [goToCoordinates, setGoToCoordinates] = useState({
    x: 0,
    y: 0,
  });

  

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={() => onClickCallback(id, inputValue, goToCoordinates)}
      type="button"
      class={`flex w-fit drop-shadow-lg text-white  ${(id === 'repeat' || id === 'repeatEnd') ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-300' : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300'} focus:outline-none focus:ring-4 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:focus:ring-blue-800`}
    >
      {id !== "goto" ? (
        <>
          <span>{leftText}</span>
          {id !== 'repeatEnd' && <input
            type="text"
            value={isSource ? "" : dropArray[selectedSprite][index].value}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              if(!isSource) {
                let val = Number(e.target.value)
              setInputValue(val);
              // commandValueRef.current[id].value = val;
              let currentDisplayArray = [...dropArray[selectedSprite]];
              currentDisplayArray[index].value = val;
              setDropArray((prevState) => {
                prevState[selectedSprite] = currentDisplayArray;
                return {...prevState};
              })
              }
            }}
            className="bg-white text-black mx-2 rounded-md w-24 z-10 pl-2"
          ></input>}
          <span>{rightText}</span>
        </>
      ) : (
        <>
          <span>Go to X:</span>
          <input
            type="text"
            value={isSource ? "" : dropArray[selectedSprite][index].value.x}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) =>{
              if(!isSource) {
                let val = Number(e.target.value)
              setGoToCoordinates({ ...goToCoordinates, x: val });
              commandValueRef.current.goto.value.x = val;
              let currentDisplayArray = [...dropArray[selectedSprite]];
              currentDisplayArray[index].value.x = val;
              setDropArray((prevState) => {
                prevState[selectedSprite] = currentDisplayArray;
                return {...prevState};
              })
              }
            }
            
            }
            className="bg-white text-black mx-2 rounded-md w-12 z-10 pl-2"
          ></input>
          <span>Y:</span>
          <input
            type="text"
            value={isSource ? "" : dropArray[selectedSprite][index].value.y}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              if(!isSource) {
                let val = Number(e.target.value);
              setGoToCoordinates({ ...goToCoordinates, y: val });
              commandValueRef.current.goto.value.y = val;
              let currentDisplayArray = [...dropArray[selectedSprite]];
              currentDisplayArray[index].value.y = val;
              setDropArray((prevState) => {
                prevState[selectedSprite] = currentDisplayArray;
                return {...prevState};
              })
              
              }
            }
              
            }
            className="bg-white text-black mx-2 rounded-md w-12 z-10 pl-2"
          ></input>
        </>
      )}
    </div>
  );
};

export default Button;
