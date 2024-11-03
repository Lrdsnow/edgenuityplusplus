// ==UserScript==
// @name        Edginuity++
// @namespace   Violentmonkey Scripts
// @match       https://r11.core.learn.edgenuity.com/player/*
// @grant       none
// @version     1.1
// @author      lrdsnow
// @description Speedrun in peace
// @grant       unsafeWindow
// @run-at      document-end
// ==/UserScript==

(function() {
    'use strict';

    function injectOpenFrameOverride() {
        const stageIframe = document.getElementById('stageFrame');
        if (stageIframe && stageIframe.contentWindow) {
            const iframeWindow = stageIframe.contentWindow;

            iframeWindow.eval(`
                (function() {
                    'use strict';

                    const originalOpenFrame = API.FrameChain.openFrame;

                    API.FrameChain.openFrame = function(order) {
                        console.log(\`openFrame was called with order: \${order}\`);

                        const nestedIframe = document.getElementById('iFramePreview');
                        if (nestedIframe) {
                            nestedIframe.onload = function() {
                                const nestedDoc = nestedIframe.contentDocument || nestedIframe.contentWindow.document;
                                if (nestedDoc.head.innerHTML.includes('Video Slide')) {
                                    const framesStatus = API.FrameChain.framesStatus;
                                    const arraySize = framesStatus.length;
                                    const currentFrame = API.FrameChain.currentFrame;
                                    if (framesStatus[currentFrame] !== 'complete') {
                                        const newStatusArray = Array(arraySize).fill('incomplete');
                                        for (let i = 0; i <= currentFrame; i++) {
                                            if (i < arraySize) {
                                                newStatusArray[i] = 'complete';
                                            }
                                        }
                                        API.FrameChain.updateFramesStatus(newStatusArray, currentFrame);
                                    };
                                }
                            };
                        }

                        originalOpenFrame.call(this, order);
                    };

                    console.log("Successfully overridden openFrame in stageFrame iframe");
                })();
            `);
        } else {
            console.log("stageFrame or its contentWindow not yet available");
        }
    }

    function modifyElementOnLoad(targetDocument) {
        const elements = targetDocument.querySelectorAll('#invis-o-div');
        if (elements.length > 0) {
            console.log(`Removing ${elements.length} invis-o-div element(s):`, elements);
            elements.forEach(element => {
                element.remove();
            });
        }
    }

    function onIframeLoad() {
        setTimeout(() => {
            const iframe = document.getElementById('stageFrame');
            if (iframe) {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                modifyElementOnLoad(iframeDocument);

                const iframeObserver = new MutationObserver(() => {
                    modifyElementOnLoad(iframeDocument);
                });
                iframeObserver.observe(iframeDocument.body, { childList: true, subtree: true });

                injectOpenFrameOverride();
            }
        }, 0);
    }

    const iframe = document.getElementById('stageFrame');
    if (iframe) {
        iframe.onload = onIframeLoad;
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'IFRAME' && node.id === 'stageFrame') {
                    node.onload = onIframeLoad;
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
