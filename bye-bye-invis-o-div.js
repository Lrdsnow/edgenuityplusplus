// ==UserScript==
// @name        Bye Bye invis-o-div
// @namespace   Violentmonkey Scripts
// @match       https://r11.core.learn.edgenuity.com/player/*
// @grant       none
// @version     1.0
// @author      lrdsnow
// @description Lets you answer questions before the intro finishes
// @grant       none
// @run-at      document-end
// ==/UserScript==

(function() {
    'use strict';

    function removeElements(targetDocument) {
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
                removeElements(iframeDocument);

                const iframeObserver = new MutationObserver(() => {
                    removeElements(iframeDocument);
                });
                iframeObserver.observe(iframeDocument.body, { childList: true, subtree: true });
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
