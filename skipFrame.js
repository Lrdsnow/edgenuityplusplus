function skipFrame() {
    const framesStatus = document.getElementById('stageFrame').contentWindow.API.FrameChain.framesStatus;
    const arraySize = framesStatus.length;
    const currentFrame = document.getElementById('stageFrame').contentWindow.API.FrameChain.currentFrame;
    const newStatusArray = Array(arraySize).fill('incomplete');
    for (let i = 0; i <= currentFrame; i++) {
        if (i < arraySize) {
            newStatusArray[i] = 'complete';
        }
    }
    document.getElementById('stageFrame').contentWindow.API.FrameChain.updateFramesStatus(newStatusArray, currentFrame + 1);
    document.getElementById('stageFrame').contentWindow.API.FrameChain.nextFrame();
}
