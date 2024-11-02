// PoC please don't use
function skipLesson() {
    const framesStatus = API.FrameChain.framesStatus;
    const arraySize = framesStatus.length;
    const newStatusArray = Array(arraySize).fill('complete');
    API.FrameChain.updateFramesStatus(newStatusArray, arraySize);
}
