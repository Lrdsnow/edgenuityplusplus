function skipFrame() {
    const framesStatus = API.FrameChain.framesStatus;
    const arraySize = framesStatus.length;
    const currentFrame = API.FrameChain.currentFrame;
    const newStatusArray = Array(arraySize).fill('incomplete');
    for (let i = 0; i <= currentFrame; i++) {
        if (i < arraySize) {
            newStatusArray[i] = 'complete';
        }
    }
    API.FrameChain.updateFramesStatus(newStatusArray, currentFrame + 1);
    API.FrameChain.nextFrame();
}
