class DataVault {
    constructor() {
        this.data = [];
        this.counter = 0;
    }

    add(text) {
        const isEmpty = this.data.length === 0;
        const notAlreadyCopiedText = text !== this.data[this.data.length - 1];
        if (isEmpty || notAlreadyCopiedText) {
            this.data.push(text);            
        }
    }

    get() {
        if (this.data.length !== 0) {
            const datum = this.data[this.counter];
            this.counter = (this.counter + 1) % this.data.length;
            return datum;
        }
        return null;
    }

    peek() {
        if (this.data.length !== 0) {
            return this.data[this.counter];
        }
        return null;
    }

    reset() {
        this.data = [];
        this.counter = 0;
    }
}

const DATA = new DataVault();

chrome.commands.onCommand.addListener((command, tab) => {
    if (command === "copy-string") {
        if (tab.id >= 0) {
            chrome.tabs.sendMessage(
                tab.id,
                {
                    command: "copy",
                },
                {},
                (resp) => {
                    if (resp && resp.data) {
                        DATA.add(resp.data);
                    }
                }
            );
        }
    } else if (command === "paste-string") {
        const peekedData = DATA.peek();
        if (peekedData != null) {
            chrome.tabs.sendMessage(tab.id, {
                command: "paste",
                data: peekedData
            }, {}, (resp) => {
                if (resp && resp.data && resp.data === true) {
                    DATA.get();
                }
            })    
        }
    } else if (command === "clear-clipboard") {
        DATA.reset();
    }
});
