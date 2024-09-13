const radians = (degrees) =>  (degrees * Math.PI / 180);
export const initialCommandRefObj = {
    moveX: { value: 0 },
    rotateClock: { value: 0 },
    rotateAnticlock: { value: 0 },
    goto: { value: { x: 0, y: 0 } },
  };

export const calculateXYPos = (currX, currY, steps = 0, degrees, canvasRef) => {
    const angleInRadians = radians(degrees);
    const {height, width} = canvasRef.current.getBoundingClientRect();
    const xMovement = steps * Math.cos(angleInRadians), yMovement = steps * Math.sin(angleInRadians);
    const xPos = currX + xMovement, yPos = currY - yMovement;
    return {x: Math.min(Math.max(xPos, 0), Number(width) - 150), y: Math.min(Math.max(yPos, 0), Number(height) - 100)};
}

export const handleCalculateNewPos = (id, commandValue, currPos, canvasRef) => {

    return new Promise((resolve, reject) => {
        switch (id) {
            case("goto"): {
                resolve({...currPos, x: commandValue.x, y:commandValue.y});
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