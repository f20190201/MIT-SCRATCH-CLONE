const radians = (degrees) =>  (degrees * Math.PI / 180);
export const initialCommandRefObj = {
    moveX: { value: 0 },
    rotateClock: { value: 0 },
    rotateAnticlock: { value: 0 },
    goto: { value: { x: 0, y: 0 } },
  };

export const repeatStartObj = {
    leftText: "Repeat",
    rightText: "times",
    id: "repeat",
    value: 0
  }

export const repeatEndObj = {
    leftText: "DONE",
    rightText: "",
    id: "repeatEnd",
    value: 0
}

export const toastProperties = {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    }

export const calculateXYPos = (currX, currY, steps = 0, degrees, canvasRef) => {
    const angleInRadians = radians(degrees);
    const {height, width} = canvasRef.current.getBoundingClientRect();
    const xMovement = steps * Math.cos(angleInRadians), yMovement = steps * Math.sin(angleInRadians);
    const xPos = currX + xMovement, yPos = currY - yMovement;
    return {x: Math.min(Math.max(xPos, 0), Number(width) - 100), y: Math.min(Math.max(yPos, 0), Number(height) - 100)};
}

export const getXBoundsForGoto = (x, canvasRef) => {

  const { width } = canvasRef.current.getBoundingClientRect();

  return Math.min(Math.max(Number(x), 0), Number(width) - 100);
}

export const getYBoundsForGoto = (y, canvasRef) => {

  const { height } = canvasRef.current.getBoundingClientRect();

  return Math.min(Math.max(Number(y), 0), Number(height) - 100);
}

export const handleCalculateNewPos = (id, commandValue, currPos, canvasRef) => {

    const {height, width} = canvasRef.current.getBoundingClientRect();

    return new Promise((resolve, reject) => {
        switch (id) {
            case("goto"): {
                resolve({...currPos, x: Math.min(Math.max(commandValue.x, 0), Number(width) - 100), y:Math.min(Math.max(commandValue.y, 0), Number(height) - 100)});
                break;
            }
            case("moveX"): {
                let {x, y} = calculateXYPos(currPos.x, currPos.y, commandValue, currPos.angle, canvasRef);
                resolve({...currPos, x, y});
                break;
            }
            case("rotateAnticlock"): {
                resolve({...currPos, angle: currPos.angle - commandValue});
                break;
            }
            case("rotateClock"): {
                resolve({...currPos, angle: currPos.angle + commandValue});
                break;
            }
            default:
                break;
        }

    })

    
}

export const animatePostCollision = async (
  data,
  position,
  canvasRef,
  setPosition
) => {
  const getSanitizedArray = simplifyDropArray(data);
  const sprite1Array = getSanitizedArray.sprite1,
    sprite2Array = getSanitizedArray.sprite2;
  const noOfSprite1 = sprite1Array.length,
    noOfSprite2 = sprite2Array.length;
  let positionCopy = { ...position };

  for (let i = 0; i < Math.max(noOfSprite1, noOfSprite2); i++) {
    if (i < noOfSprite1) {
      // id, commandValue, currPos, canvasRef
      let commandObj = [...sprite1Array][i];
      positionCopy = {
        ...positionCopy,
        sprite1: await handleCalculateNewPos(
          commandObj.id,
          commandObj.value,
          positionCopy.sprite1,
          canvasRef
        ),
      };

    }

    if (i < noOfSprite2) {
      let commandObj = [...sprite2Array][i];
      positionCopy = {
        ...positionCopy,
        sprite2: await handleCalculateNewPos(
          commandObj.id,
          commandObj.value,
          positionCopy.sprite2,
          canvasRef
        ),
      };
    }

    setPosition({ ...positionCopy });
    await pause(300);
  }
};

export const sanitizedArray = (data) => {
  const repeatIndex = data.findIndex((element) => element.id === "repeat");
  const repeatEndIndex = data.findIndex(
    (element) => element.id === "repeatEnd"
  );

  if(repeatIndex === -1) {
    return [...data];
  }

  const repeatCount = data[repeatIndex].value;

  const elementsToRepeat = data.slice(repeatIndex + 1, repeatEndIndex);

  let repeatedElements = [];
  for (let i = 0; i < repeatCount; i++) {
    repeatedElements = repeatedElements.concat(
      elementsToRepeat.map((element) => ({ ...element, isInsideRepeat: true }))
    );
  }

  const result = [
    ...data
      .slice(0, repeatIndex)
      .map((element) => ({ ...element, isInsideRepeat: false })), 
    ...repeatedElements, 
    ...data
      .slice(repeatEndIndex + 1)
      .map((element) => ({ ...element, isInsideRepeat: false })),
  ];
  return result;
};

export const simplifyDropArray = (dropArray) => {
    let dropArrayCopy = {...dropArray};

    Object.keys(dropArrayCopy).forEach(selectedSprite => {
        dropArrayCopy[selectedSprite] = sanitizedArray(dropArrayCopy[selectedSprite]);
    })

    return dropArrayCopy;
}

export const getPostCollisionMovementArray = (data, idx) => {

    const dataCopy = [...data];
    const toReverse = dataCopy.slice(0, idx + 1);
    const reversed = toReverse.reverse().map((item) => {
      if (item.id === "moveX") {
        return { ...item, value: -item.value }; // Multiply by -1
      }
      return item; 
    });
    return [...reversed];
}

export const getCenter = (imageRef) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      return ({ x: centerX, y: centerY });
    }
  };

export const distanceBetweenTwoPoints = (x1, x2, y1, y2) => {
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

export const rotateAllByXDegrees = (posObj) => {
    let posObjCopy = {...posObj};

    Object.keys(posObjCopy).forEach((currentSprite) => {
        posObjCopy[currentSprite].angle = 180 - posObjCopy[currentSprite].angle;
    })

    return posObjCopy;
}

export const pause = (duration) => {
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
};

export const isSprite1Selected = (selectedSprite) => selectedSprite === 'sprite1';

export const getCommandRefObj = (destinationButtonsArray) => {
    const destinationButtonsArrayCopy = [...destinationButtonsArray]
    let obj = {...initialCommandRefObj};
    destinationButtonsArrayCopy.forEach(element => {obj[element.id].value = element.value});
    return obj;
}

export const handleRepeat = async (noOfTimes, dropArray, selectedSprite, handleButtonCallback) => {

    return new Promise(async (resolve, reject) => {
      const displayArray = [...dropArray[selectedSprite]];
      const startIndex = displayArray.findIndex((element) => element.id === 'repeat');
      const endIndex = displayArray.findIndex((element) => element.id === 'repeatEnd');
  
      for(let i = 0 ; i < noOfTimes ; i++) {
        for(let j = startIndex + 1 ; j < endIndex ; j++) {
          const commandObj = displayArray[j];
          handleButtonCallback(commandObj.id, commandObj.value, commandObj.value);
          await pause(300);
        }
      }
      resolve();
    })

  }

export const getObjPertainingToId = (id, array) => {
    const arrayCopy = [...array, id];
    let obj = {}, idx = 0;

    arrayCopy.forEach((element, index) => {
        if(element.id === id){
            obj = {...element};
            idx = index;
        }      
    })
    return [obj, idx];
}