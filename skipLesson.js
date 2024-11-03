// PoC please don't use
function skipLesson() {
    const framesStatus = document.getElementById('stageFrame').contentWindow.API.FrameChain.framesStatus;
    const arraySize = framesStatus.length;
    const newStatusArray = Array(arraySize).fill('complete');
    document.getElementById('stageFrame').contentWindow.API.FrameChain.updateFramesStatus(newStatusArray, arraySize);
    document.getElementById('stageFrame').contentWindow.API.FrameChain.openFrame(arraySize);
}
