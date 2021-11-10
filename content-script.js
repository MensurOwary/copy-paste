(function () {
    const checkIfEditable = (domElement) => {
        return [HTMLInputElement, HTMLTextAreaElement].some(
            (type) => domElement instanceof type
        );
    };

    chrome.runtime.onMessage.addListener(function (message, sender, respond) {
        const { command } = message;
        if (command === "copy") {
            if (window.getSelection) {
                const text = window.getSelection().toString();
                if (text && text.length > 0) {
                    respond({
                        data: text,
                    });
                }
            }
        } else if (command === "paste") {
            const { data } = message;

            var currentElement = document.activeElement;
            let success = false;
            if (checkIfEditable(currentElement)) {
                // TODO: for now I'm ignoring the cursor
                currentElement.value += data;
                success = true;
            }

            respond({
                data: success
            })
        }
    });
})();
