const EventEmitter = require('events');
const {webkit, chromium, firefox} = require('playwright');

class PwBrowser extends EventEmitter {
    /**
     * @param {import('playwright').BrowserType} browserType
     */
    constructor(browserType) {
        super();
        this._browserType = browserType;
        this.name = browserType.name();
        this.id = Math.random();
    }

    /**
     * @param {string} url 
     */
    async start(url) {
        this._browser = await this._browserType.launch({headless: true});
        this._browser.on('close', () => this.emit('done'));
        const page = await this._browser.newPage();
        await page.goto(`${url}?id=${this.id}`);
    }

    isCaptured() {
        return true;
    }

    async forceKill() {
        await this._browser.close();
    }
}

// Karma actually parses the function.toString, so we can't pass in the class.
function ChromiumBrowserWrapper() {
    return new PwBrowser(chromium);
}

// Karma actually parses the function.toString, so we can't pass in the class.
function FirefoxBrowserWrapper() {
    return new PwBrowser(firefox);
}

// Karma actually parses the function.toString, so we can't pass in the class.
function WebKitBrowserWrapper() {
    return new PwBrowser(webkit);
}

module.exports = {
  'launcher:Chromium': ['type', ChromiumBrowserWrapper],
  'launcher:Firefox': ['type', FirefoxBrowserWrapper],
  'launcher:WebKit': ['type', WebKitBrowserWrapper],
}
