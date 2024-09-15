import React from 'react'
import { getXBoundsForGoto, getYBoundsForGoto } from '../Data/Helper';

const SpriteStats = ({canvasRef, setPosition, position, dropArray, showToast, setDropArray, setNoOfSprites, selectedSprite, setSelectedSprite, noOfSprites, currentCommandIndex, handleAnimateAll}) => {
  return (
    <div className="row-span-2 mr-4 mb-4 rounded-md drop-shadow-xl bg-white">
      <div
        onClick={() => {
          if (noOfSprites === 2) {
            showToast("Support for more than 2 sprites coming soon!", "info");
          } else {
            setNoOfSprites(2);
          }
        }}
        class="flex cursor-pointer ml-2 mt-2 w-fit drop-shadow-lg text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:focus:ring-blue-800"
      >
        &#43; Add Sprite
      </div>

      <div
        onClick={() => handleAnimateAll({ ...dropArray }, true)}
        class="flex absolute right-0 top-0 cursor-pointer mr-2 mt-2 w-fit drop-shadow-lg text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:focus:ring-blue-800"
      >
        ANIMATE ALL
      </div>

      <div className="grid grid-cols-5 gap-4 mt-4 ml-4">
        <div
          className={`col-start-1 h-16 cursor-pointer p-2 w-20 drop-shadow-lg rounded-lg ${
            selectedSprite === "sprite1" && "border-2 border-purple-500"
          }`}
          style={{ background: "azure" }}
          onClick={() => {
            setSelectedSprite("sprite1");
            currentCommandIndex.current = 0;
          }}
        >
          <img
            id="sprite1"
            src="/catSprite2.png"
            alt="cat sprite"
            className=""
          ></img>
        </div>
        {noOfSprites === 2 && (
          <div
            style={{ background: "azure" }}
            onClick={() => {
              setSelectedSprite("sprite2");
              currentCommandIndex.current = 0;
            }}
            className={`col-start-2 cursor-pointer h-16 p-2 w-20 drop-shadow-lg rounded-lg relative ${
              selectedSprite === "sprite2" && "border-2 border-purple-500"
            }`}
          >
            <img id="sprite2" src="/dogSprite2.png" alt="dog sprite"></img>
            <div
              onClick={() => {
                setSelectedSprite("sprite1");
                setDropArray((prevState) => ({ ...prevState, sprite2: [] }));
                setNoOfSprites(1);
              }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer"
            >
              <span className="text-white text-xs font-bold">✕</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-4 mt-4 ml-4">
        <div className="">
        X: <input value={Math.round(position[selectedSprite].x)}
        onChange={(e) => {
          
          setPosition((prevPos) => {
            return ({...prevPos, [selectedSprite]: {...prevPos[selectedSprite], x: getXBoundsForGoto(e.target.value, canvasRef)}})
          })
        }}
        className="bg-white text-black border-purple-500 border-2 mx-2 rounded-full w-12 z-10 py-1 text-center text-sm"></input>
        </div>
        <div className="">
        Y: <input value={Math.round(position[selectedSprite].y)}
        onChange={(e) => {
          setPosition((prevPos) => ({...prevPos, [selectedSprite]: {...prevPos[selectedSprite], y: getYBoundsForGoto(e.target.value, canvasRef)}}))
        }}
        className="bg-white text-black border-purple-500 border-2 mx-2 rounded-full w-12 z-10 py-1 text-center text-sm"></input>
        </div>
      </div>

    </div>
  );
}

export default SpriteStats