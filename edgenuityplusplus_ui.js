// ==UserScript==
// @name        Edginuity++ w/ UI
// @namespace   Violentmonkey Scripts
// @match       https://r11.core.learn.edgenuity.com/player/*
// @grant       none
// @version     1.2
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
                                if (localStorage.getItem("skipVideos") === 'true') {
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
                                  };
                                };
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
        if (localStorage.getItem("allowAnswering") === 'true') {
          const elements = targetDocument.querySelectorAll('#invis-o-div');
          if (elements.length > 0) {
              console.log(`Removing ${elements.length} invis-o-div element(s):`, elements);
              elements.forEach(element => {
                  element.remove();
              });
          };
        };
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

(function() {
    'use strict';

    const floatWindow = document.createElement("div");
    floatWindow.style.position = "fixed";
    floatWindow.style.width = "192px";
    floatWindow.style.height = "178px";
    floatWindow.style.top = "120px";
    floatWindow.style.left = "100px";
    floatWindow.style.backgroundColor = "#000000";
    floatWindow.style.border = "2px solid #000000";
    floatWindow.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
    floatWindow.style.zIndex = "1000";
    floatWindow.style.resize = "both";
    floatWindow.style.overflow = "auto";
    floatWindow.style.color = "#8a2be2";
    floatWindow.style.fontFamily = "Arial, sans-serif";
    document.body.appendChild(floatWindow);

    const titleBar = document.createElement("div");
    titleBar.style.display = "flex";
    titleBar.style.alignItems = "center";
    titleBar.style.justifyContent = "space-between";
    titleBar.style.backgroundColor = "#000000";
    titleBar.style.color = "#8a2be2";
    titleBar.style.padding = "5px 10px";
    titleBar.style.cursor = "move";

    const sparkleIcon = document.createElement("img");
    sparkleIcon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABUklEQVR4nO2UMUoEQRBFP4jIisoGCkbewFAwXRPZDcxcFAw0mWBhuroFIxND8S4eQo9groEoCIoYiIZfSmxoh+ndGnESsaCgaZr/qn7VDPAnw4Mbmq2Ij8BlAXc19dyG+FYE6PnXIGpJIvwtfY1dATzw4LMDByZAAHs5QAB76VsBux588iA9eFOCMyZICS4J2E/E+3pX0+3Zl3hMMQESyCegTtyBKwK+pwABH7UrM0QtqdqSiF9Vqo95UVeQKUbgnIAnAr5lxGMnrx48PQLnzeIO3EsGas1783YJeN1QPHZzaQVsNoXonAK4brapAKc9WHjwYYLwnb7bBqdyfq9pjummq9uSAZwHsJOtUifvwB3NElzIvTsEFwV8qVZegLNZ8QCuenCY/HuGejemk+MKYD8r/hNAADsC3saBZj1PQ22JFlk+FAcOdBUbbcukIf8H2ogPm+yJEioWjvQAAAAASUVORK5CYII=";
    sparkleIcon.alt = "";
    sparkleIcon.width = 20;
    sparkleIcon.height = 20;
    sparkleIcon.style.marginRight = "10px";
    titleBar.appendChild(sparkleIcon);

    const titleText = document.createElement("span");
    titleText.textContent = "Edgenuity++";
    titleText.style.flexGrow = "1";
    titleText.style.textAlign = "center";
    titleText.style.fontWeight = "bold";
    titleBar.appendChild(titleText);

    const closeButton = document.createElement("span");
    closeButton.textContent = "X";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontWeight = "bold";
    closeButton.onclick = () => floatWindow.remove();
    titleBar.appendChild(closeButton);

    floatWindow.appendChild(titleBar);

    const createToggleSwitch = (label, key) => {
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.margin = "10px";

        const toggle = document.createElement("label");
        toggle.style.position = "relative";
        toggle.style.display = "inline-block";
        toggle.style.width = "34px";
        toggle.style.height = "20px";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = localStorage.getItem(key) === 'true';
        input.style.opacity = "0";
        input.style.width = "0";
        input.style.height = "0";

        const slider = document.createElement("span");
        slider.style.position = "absolute";
        slider.style.cursor = "pointer";
        slider.style.top = "0";
        slider.style.left = "0";
        slider.style.right = "0";
        slider.style.bottom = "0";
        slider.style.backgroundColor = "#888";
        slider.style.transition = ".4s";
        slider.style.borderRadius = "20px";

        const knob = document.createElement("span");
        knob.style.position = "absolute";
        knob.style.height = "12px";
        knob.style.width = "12px";
        knob.style.left = "4px";
        knob.style.bottom = "4px";
        knob.style.backgroundColor = "#8a2be2";
        knob.style.borderRadius = "50%";
        knob.style.transition = ".4s";
        slider.appendChild(knob);

        toggle.appendChild(input);
        toggle.appendChild(slider);

        input.onchange = function () {
            localStorage.setItem(key, input.checked);
            slider.style.backgroundColor = input.checked ? "#8a2be2" : "#17002b";
            knob.style.transform = input.checked ? "translateX(14px)" : "translateX(0)";
            knob.style.backgroundColor = input.checked ? "black" : "#8a2be2"; // Change knob color
        };

        slider.style.backgroundColor = input.checked ? "#8a2be2" : "#17002b";
        knob.style.transform = input.checked ? "translateX(14px)" : "translateX(0)";
        knob.style.backgroundColor = input.checked ? "black" : "#8a2be2"; // Change knob color

        const labelElement = document.createElement("span");
        labelElement.textContent = label;
        labelElement.style.marginLeft = "10px";

        container.appendChild(toggle);
        container.appendChild(labelElement);
        return container;
    };

    const skipVideosToggle = createToggleSwitch("Skip Videos", "skipVideos");
    floatWindow.appendChild(skipVideosToggle);

    const allowAnsweringToggle = createToggleSwitch("Skip Intro", "allowAnswering");
    floatWindow.appendChild(allowAnsweringToggle);

    const skipButton = document.createElement("button");
    skipButton.textContent = "Complete Current Frame/Task";
    skipButton.style.backgroundColor = "#5300a1";
    skipButton.style.color = "#ffffff";
    skipButton.style.border = "none";
    skipButton.style.borderRadius = "24px";
    skipButton.style.padding = "10px 15px";
    skipButton.style.margin = "10px";
    skipButton.style.cursor = "pointer";
    skipButton.style.fontSize = "14px";
    skipButton.style.transition = "background-color 0.3s";

    skipButton.onmouseover = () => {
        skipButton.style.backgroundColor = "#8f47d1";
    };
    skipButton.onmouseout = () => {
        skipButton.style.backgroundColor = "#5300a1";
    };

    skipButton.onclick = () => {
        const framesStatus = unsafeWindow.document.getElementById('stageFrame').contentWindow.API.FrameChain.framesStatus;
        const arraySize = framesStatus.length;
        const currentFrame = unsafeWindow.document.getElementById('stageFrame').contentWindow.API.FrameChain.currentFrame;
        const newStatusArray = Array(arraySize).fill('incomplete');
        for (let i = 0; i <= currentFrame; i++) {
            if (i < arraySize) {
                newStatusArray[i] = 'complete';
            }
        }
        unsafeWindow.document.getElementById('stageFrame').contentWindow.API.FrameChain.updateFramesStatus(newStatusArray, currentFrame);
    };
    floatWindow.appendChild(skipButton);

    titleBar.onmousedown = function(event) {
        let shiftX = event.clientX - floatWindow.getBoundingClientRect().left;
        let shiftY = event.clientY - floatWindow.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            floatWindow.style.left = pageX - shiftX + "px";
            floatWindow.style.top = pageY - shiftY + "px";
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener("mousemove", onMouseMove);

        document.onmouseup = function() {
            document.removeEventListener("mousemove", onMouseMove);
            document.onmouseup = null;
        };
    };

    titleBar.ondragstart = function() {
        return false;
    };
})();
