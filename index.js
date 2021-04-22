const EventEmitter = require('events');
const {devices, webkit, chromium, firefox} = require('playwright');

class PwBrowser extends EventEmitter {
    /**
     * @param {import('playwright').BrowserType} browserType
     */
    constructor(browserType, name, headless, args) {
        super();
        this._browserType = browserType;
        this._headless = headless;
        this._args = args;
        this.name = name;
        this.id = Math.random();
    }

    /**
     * @param {string} url
     */
    async start(url) {
        this._browser = await this._browserType.launch({ headless: this._headless, ...this._args.launchOptions });
        this._browser.on('close', () => this.emit('done'));
        const page = await this._browser.newPage({ ...devices[this._args.device], ...this._args.contextOptions });
        await page.goto(`${url}?id=${this.id}&displayName=${encodeURIComponent(this.displayName || this.name)}`);
    }

    isCaptured() {
        return true;
    }

    async forceKill() {
        if (this._browser) {
            await this._browser.close();
        }
    }
}

// Karma actually parses the function.toString, so we can't pass in the class.
function ChromiumBrowserWrapper(args) {
    return new PwBrowser(chromium, 'Chromium', false, args);
}

function ChromiumHeadlessBrowserWrapper(args) {
    return new PwBrowser(chromium, 'ChromiumHeadless', true, args);
}

function FirefoxBrowserWrapper(args) {
    return new PwBrowser(firefox, 'Firefox', false, args);
}

function FirefoxHeadlessBrowserWrapper(args) {
    return new PwBrowser(firefox, 'FirefoxHeadless', true, args);
}

function WebKitBrowserWrapper(args) {
    return new PwBrowser(webkit, 'WebKit', false, args);
}

function WebKitHeadlessBrowserWrapper(args) {
    return new PwBrowser(webkit, 'WebKitHeadless', true, args);
}

module.exports = {
  'launcher:Chromium':         ['type', ChromiumBrowserWrapper],
  'launcher:ChromiumHeadless': ['type', ChromiumHeadlessBrowserWrapper],
  'launcher:Firefox':          ['type', FirefoxBrowserWrapper],
  'launcher:FirefoxHeadless':  ['type', FirefoxHeadlessBrowserWrapper],
  'launcher:WebKit':           ['type', WebKitBrowserWrapper],
  'launcher:WebKitHeadless':   ['type', WebKitHeadlessBrowserWrapper],
}
