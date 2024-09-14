import "./App.css";
import Control from "./components/Control";
import { DragDropContext } from "react-beautiful-dnd";
import { useEffect, useRef, useState } from "react";
import { calculateXYPos, initialCommandRefObj, handleCalculateNewPos, pause, distanceBetweenTwoPoints, getCenter, toastProperties, handleRepeat, simplifyDropArray, getPostCollisionMovementArray, animatePostCollision } from "./Data/Helper";
import SpriteStats from "./components/SpriteStats";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  
  const [dropArray, setDropArray] = useState({
    sprite1: [],
    sprite2: [],
  });
  const [position, setPosition] = useState({ sprite1: {x: 0, y: 0, angle: 0}, sprite2: {x: 0, y: 0, angle: 0}});
  const [selectedSprite, setSelectedSprite] = useState("sprite1");
  const [noOfSprites, setNoOfSprites] = useState(1);
  const commandValueRef = useRef(initialCommandRefObj);
  const [isPlayAllClicked, setIsPlayAllClicked] = useState(false);
  const currentCommandIndex = useRef(0);
  const canvasRef = useRef(null);
  const sprite1Ref = useRef(null), sprite2Ref = useRef(null);
  const collisionRef = useRef(false);
  const positionRef = useRef({ sprite1: {x: 0, y: 0, angle: 0}, sprite2: {x: 0, y: 0, angle: 0}});

  const showToast = (toastMessage = "Sorry, something's wrong", type = "") => {
      switch (type) {
        case "error":
          toast.error(toastMessage, toastProperties);
          break;
        case "info":
          toast.info(toastMessage, toastProperties);
          break;
        case "success":
          toast.success(toastMessage, toastProperties);
          break;
        default:
          toast(toastMessage, toastProperties);
          break;
      }
  }

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    const { droppableId: sourceId, index: sourceIndex } = source;
    const { droppableId: destinationId, index: destinationIndex } = destination;

    if (!destination) return;
   
    if (sourceId === destinationId) {
      if(sourceId === 'motionArea')
      return; // Items dragged within the same list

      const currentDisplayArray = [...dropArray[selectedSprite]];
      const [movedItem] = currentDisplayArray.splice(sourceIndex, 1);
      currentDisplayArray.splice(destinationIndex, 0, movedItem);

      setDropArray((prevState) => ({...prevState, [selectedSprite]: currentDisplayArray}));
    }

    if (sourceId === "motionArea" && destinationId === "dropArea") {
      const movedItem = [
        {
          leftText: "Move",
          rightText: "Steps",
          id: "moveX",
          value: 0
        },
        {
          leftText: "Turn Clockwise",
          rightText: "Degrees",
          id: "rotateClock",
          value: 0
        },
        {
          leftText: "Turn Anticlockwise",
          rightText: "Degrees",
          id: "rotateAnticlock",
          value: 0
        },
        {
          leftText: "Repeat",
          rightText: "times",
          id: "repeat",
          value: 0
        },
        { id: "goto", value: {x: 0, y: 0} },
      ][sourceIndex];
      const currentDisplayArray = [...dropArray[selectedSprite]];
      if(movedItem.id === 'repeat') {
        currentDisplayArray.splice(destinationIndex, 0, {
          leftText: "Repeat",
          rightText: "times",
          id: "repeat",
          value: 0
        }, {
          leftText: "DONE",
          rightText: "",
          id: "repeatEnd",
          value: 0
      });  
      } else {
        currentDisplayArray.splice(destinationIndex, 0, movedItem);
      }
      
      setDropArray((prevDropArray) => ({...prevDropArray, [selectedSprite]: currentDisplayArray}))
  
    } else if (sourceId === "dropArea" && destinationId === "motionArea") {
      setDropArray((prevState) => {
        let displayArray = prevState[selectedSprite];
        displayArray.splice(sourceIndex, 1);

        return {...prevState, [selectedSprite]: displayArray};
      })
    }
  };

  const handleAfterCollisionMovement = async (prevPos, currPos, sprite1Index, sprite2Index, sanitizedArray) => {

    return new Promise(async (resolve, reject) => {
      const postCollisionArray1 = getPostCollisionMovementArray(sanitizedArray.sprite1, sprite1Index), postCollisionArray2 = getPostCollisionMovementArray(sanitizedArray.sprite2, sprite2Index);
  
      // await pause(150);
      // const {sprite1: {x: x1Initial, y: y1Initial, angle: angle1}, sprite2: {x: x2Initial, y: y2Initial, angle: angle2}} = prevPos;
      // const {sprite1: {x: x1final, y: y1final, angle: angle1final}, sprite2: {x: x2final, y: y2final, angle: angle2final}} = currPos;
  
      // const distByS1 = distanceBetweenTwoPoints(x1Initial, x1final, y1Initial, y1final);
      // const distByS2 = distanceBetweenTwoPoints(x2Initial, x2final, y2Initial, y2final);
  
      // const {x: newX1, y: newY1} = calculateXYPos(x1final, y1final, -distByS2, angle1final, canvasRef);
      // const {x: newX2, y: newY2} = calculateXYPos(x2final, y2final, -distByS1, angle2final, canvasRef);
  
      // positionRef.current = {sprite1: {x: newX1, y: newY1, angle: angle1final}, sprite2: {x: newX2, y: newY2, angle: angle2final}};
      // setPosition({sprite1: {x: newX1, y: newY1 - 10, angle: angle1final}, sprite2: {x: newX2, y: newY2 - 10, angle: angle2final}});
  
      // handleAnimateAll({sprite1: postCollisionArray1, sprite2: postCollisionArray2}, false);

      await animatePostCollision({sprite1: postCollisionArray2, sprite2: postCollisionArray1}, currPos, canvasRef, setPosition);

      resolve();
    })

    
  }

  const trackPositionDuringAnimation = (prevPosition, sprite1Index, sprite2Index, sanitizedArray, isCollisionCheck) => {
    
    const intervalId = setInterval(async () => {
      if (sprite1Ref.current) {
        const rect1 = sprite1Ref.current.getBoundingClientRect();
        const rect2 = sprite2Ref.current.getBoundingClientRect();
        const {x: centerX1, y: centerY1} = getCenter(sprite1Ref);
        const {x: centerX2, y: centerY2} = getCenter(sprite2Ref);
        const dist = distanceBetweenTwoPoints(centerX1, centerX2, centerY1, centerY2);

        if(isCollisionCheck && (dist < 80)) {
        showToast("Collision!", "success");
        const {left, bottom} = canvasRef.current.getBoundingClientRect();
        
        const collisionPosition = { sprite1: {...position.sprite1, x: Math.abs(rect1.left - left) , y: Math.abs(rect1.bottom - bottom)}, sprite2: {...position.sprite2, x: Math.abs(rect2.left - left) , y: Math.abs(rect2.bottom - bottom)}}
        setPosition({...collisionPosition});
        positionRef.current = {...collisionPosition};
        
        collisionRef.current = true;
        clearInterval(intervalId);
        await handleAfterCollisionMovement(prevPosition, collisionPosition, sprite1Index, sprite2Index, sanitizedArray);
        }
      }
    }, 1);

      setTimeout(() => {
        clearInterval(intervalId);
      }, 300)
  };

  const handleButtonCallback = (id, inputValue, goToCoordinates) => {
    return new Promise(async (resolve) => {
      const {height, width} = canvasRef.current.getBoundingClientRect();
      switch (id) {
        case "repeat": {
          await handleRepeat(inputValue, dropArray, selectedSprite, handleButtonCallback);
          resolve();
          break;
        }
        case "moveY":
        case "moveX": {
          const { x, y } = calculateXYPos(
            positionRef.current[selectedSprite].x,
            positionRef.current[selectedSprite].y,
            inputValue,
            positionRef.current[selectedSprite].angle,
            canvasRef
          );
          setPosition((prevState) => {
            const selectedSpritePos = prevState[selectedSprite];
            positionRef.current = {...prevState, [selectedSprite]: {...selectedSpritePos, x, y}}
            return {...prevState, [selectedSprite]: {...selectedSpritePos, x, y}};
          });
          break;
        }
        case "rotateClock": {
          setPosition((prevState) => {
            const selectedSpritePos = prevState[selectedSprite];
            positionRef.current = {...prevState, [selectedSprite]: {...selectedSpritePos, angle: selectedSpritePos.angle + Number(inputValue)}};
            return {...prevState, [selectedSprite]: {...selectedSpritePos, angle: selectedSpritePos.angle + Number(inputValue)}};
          });
          break;
        }
        case "rotateAnticlock": {
          setPosition((prevState) => {
            const selectedSpritePos = prevState[selectedSprite];
            positionRef.current = {...prevState, [selectedSprite]: {...selectedSpritePos, angle: selectedSpritePos.angle - Number(inputValue)}};
            return {...prevState, [selectedSprite]: {...selectedSpritePos, angle: selectedSpritePos.angle - Number(inputValue)}};
          });
          break;
        }
  
        case "goto": {
          setPosition((prevState) => {
            const selectedSpritePos = prevState[selectedSprite];
            positionRef.current = {...prevState, [selectedSprite]: {...selectedSpritePos, x: Math.min(Math.max(goToCoordinates.x, 0), Number(width) - 100), y: Math.min(Math.max(goToCoordinates.y, 0), Number(height) - 100)}};
            return {...prevState, [selectedSprite]: {...selectedSpritePos, x: Math.min(Math.max(goToCoordinates.x, 0), Number(width) - 100), y: Math.min(Math.max(goToCoordinates.y, 0), Number(height) - 100)}};
          });
          break;
        }
  
        default:
          break;
      }
      resolve();
    })

    
  };
  const handlePlayAll = async() => {
    
    const displayArray = dropArray[selectedSprite]
    if (displayArray.length === 0) return;
    setIsPlayAllClicked(true);

    for(let i = 0 ; i < displayArray.length; i++) {
      const id = displayArray[i]["id"];
      await handleButtonCallback(id, displayArray[i].value, displayArray[i].value);
      await pause(100);
    }

    setIsPlayAllClicked(false);
  };
  const handleDragStart = (e) => {
    const img = e.target;
    const rect = img.getBoundingClientRect();
    // Store offset to ensure the image drops relative to where it was picked
    e.dataTransfer.setData("offsetX", e.clientX - rect.left);
    e.dataTransfer.setData("offsetY", e.clientY - rect.bottom);
  };

  // Function to handle drop
  const handleDrop = (e) => {
    e.preventDefault();

    // Get the drop position relative to the viewport
    const dropX = e.clientX;
    const dropY = e.clientY;

    // Get the parent container's bounding box
    const container = e.currentTarget.getBoundingClientRect();

    // Retrieve offsets
    const offsetX = e.dataTransfer.getData("offsetX");
    const offsetY = e.dataTransfer.getData("offsetY");

    // Calculate position relative to the container's bottom-left
    const left = dropX - container.left - offsetX;
    const bottom = container.bottom - dropY - offsetY;

    setPosition((prevState) => {
      // ({ ...prevState, x: left, y: bottom })
      const selectedSpritePos = prevState[selectedSprite];
      return {...prevState, [selectedSprite]: {...selectedSpritePos, x: left, y: bottom}}
    });
  };

  const handleAnimateAll = async (data, isCollisionCheck = false) => {
    collisionRef.current = false;

    const getSanitizedArray = simplifyDropArray(data)
    const sprite1Array = getSanitizedArray.sprite1, sprite2Array = getSanitizedArray.sprite2;
    const noOfSprite1 = sprite1Array.length, noOfSprite2 = sprite2Array.length;
    let positionCopy = {...position};

    for(let i = 0 ; i < Math.max(noOfSprite1, noOfSprite2) ; i++) {

      if(collisionRef.current === true)
        continue;
      
      if(i < noOfSprite1) {
        // id, commandValue, currPos, canvasRef
        let commandObj = [...sprite1Array][i];
        positionCopy = {...positionCopy, sprite1: await handleCalculateNewPos(commandObj.id, commandObj.value, positionCopy.sprite1, canvasRef)};
      }

      if(i < noOfSprite2) {
        let commandObj = [...sprite2Array][i];
        positionCopy = {...positionCopy, sprite2: await handleCalculateNewPos(commandObj.id, commandObj.value, positionCopy.sprite2, canvasRef)};
      }

      if(isCollisionCheck === true) {
        trackPositionDuringAnimation({...position}, Math.min(i, noOfSprite1), Math.min(i, noOfSprite2), getSanitizedArray, isCollisionCheck);
      }
      if(collisionRef.current)
        break;
      else setPosition({...positionCopy});
      
      await pause(320);
    }

  }

  useEffect(() => {
    if(noOfSprites === 1) {
      setSelectedSprite("sprite1");
      setDropArray((prevState) => ({...prevState, sprite2: []}));
      setPosition({...position, sprite2: {x: 0, y: 0, angle: 0}});
      positionRef.current = {...positionRef.current, sprite2: {x: 0, y: 0, angle: 0}};
    }
  }, [noOfSprites])

  return (
    <div className="App">
      <div className="bg-gray-300">
        <div className="flex gap-2">
        <ToastContainer />
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="w-2/3 bg-white flex h-[98vh] m-4 rounded-md drop-shadow-xl">
              <div className="w-[40%] border-r-2">
                <Control
                  buttonsArray={[
                    {
                      leftText: "Move",
                      rightText: "Steps",
                      id: "moveX",
                      value: 0
                    },
                    {
                      leftText: "Turn Clockwise",
                      rightText: "Degrees",
                      id: "rotateClock",
                      value: 0
                    },
                    {
                      leftText: "Turn Anticlockwise",
                      rightText: "Degrees",
                      id: "rotateAnticlock",
                      value: 0
                    },
                    {
                      leftText: "Repeat",
                      rightText: "times",
                      id: "repeat",
                      value: 0
                    },
                    { id: "goto", value: {x: 0, y: 0} },
                  ]}
                  droppableIdName={"motionArea"}
                  isSource={true}
                />
              </div>

              <div className="w-[60%] relative">
                <div
                  onClick={handlePlayAll}
                  class="flex cursor-pointer ml-2 mt-2 w-fit drop-shadow-lg text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:focus:ring-blue-800"
                >
                  PLAY ALL
                </div>
                <Control
                  buttonsArray={[...dropArray[selectedSprite]]}
                  dropArray={dropArray}
                  setDropArray={setDropArray}
                  droppableIdName={"dropArea"}
                  handleButtonCallback={handleButtonCallback}
                  commandValueRef={commandValueRef}
                  selectedSprite={selectedSprite}
                  isSource={false}
                />
              </div>
            </div>
          </DragDropContext>

          <div className="w-1/3 grid grid-cols-1 grid-rows-6">
            <div
              ref={canvasRef}
              className=" bg-white row-span-4 mr-4 mt-4 mb-2 rounded-md drop-shadow-xl relative"
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
              }}
            >
              <img
                ref={sprite1Ref}
                id="sprite1"
                src="/catSprite2copy.png"
                alt="cat sprite"
                draggable="true"
                onDragStart={handleDragStart}
                style={{
                  height: "100px",
                  width: "100px",
                  position: "absolute",
                  bottom: position.sprite1.y,
                  left: position.sprite1.x,
                  transform: `rotate(${position.sprite1.angle}deg)`, // Apply rotation here
                  transition:
                    "transform 0.3s ease-in-out, bottom 0.3s ease-in-out, left 0.3s ease-in-out", // Smooth transition
                }}
              />

              {noOfSprites == 2 && (
                <img
                  ref={sprite2Ref}
                  id="sprite2"
                  src="/dogSprite2copy.png"
                  alt="dog sprite"
                  draggable="true"
                  onDragStart={handleDragStart}
                  style={{
                    height: "100px",
                    width: "90px",
                    position: "absolute",
                    bottom: position.sprite2.y,
                    left: position.sprite2.x,
                    transform: `rotate(${position.sprite2.angle}deg)`, // Apply rotation here
                    transition:
                      "transform 0.3s ease-in-out, bottom 0.3s ease-in-out, left 0.3s ease-in-out", // Smooth transition
                  }}
                />
              )}
            </div>
            <SpriteStats
              dropArray={dropArray}
              currentCommandIndex={currentCommandIndex}
              setNoOfSprites={setNoOfSprites}
              selectedSprite={selectedSprite}
              setSelectedSprite={setSelectedSprite}
              noOfSprites={noOfSprites}
              handleAnimateAll={handleAnimateAll}
              setDropArray={setDropArray}
              showToast={showToast}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
