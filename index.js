const {devices, webkit, chromium, firefox} = require('playwright');

function applyDecorators(self, baseLauncherDecorator, captureTimeoutLauncherDecorator, retryLauncherDecorator) {
    baseLauncherDecorator(self);
    captureTimeoutLauncherDecorator(self);
    retryLauncherDecorator(self);
}

function pwBrowser(self, name, browserType, headless, args, logger) {
    self.name = self.displayName = name;

    self.on("start", async (url) => {
        const log = logger.create(self.displayName);

        try {
            self._browser = await browserType.launch({ headless, ...args.launchOptions });

            const page = await self._browser.newPage({ ...devices[args.device], ...args.contextOptions });
            await page.goto(url);
        } catch (err) {
            log.error(err);
            self._done("failure");
        }
    });

    self.on("kill", async (done) => {
        const log = logger.create(self.displayName);

        try {
            self._browser && await self._browser.close();
        } catch (err) {
            log.error(err);
        }

        self._done();
        return process.nextTick(done);
    });
}

function ChromiumBrowser(args, logger, baseLauncherDecorator, captureTimeoutLauncherDecorator, retryLauncherDecorator) {
    applyDecorators(this, baseLauncherDecorator, captureTimeoutLauncherDecorator, retryLauncherDecorator);
    pwBrowser(this, 'Chromium', chromium, false, args, logger);
}

function ChromiumHeadlessBrowser(args, logger, baseLauncherDecorator, captureTimeoutLauncherDecorator, retryLauncherDecorator) {
    applyDecorators(this, baseLauncherDecorator, captureTimeoutLauncherDecorator, retryLauncherDecorator);
    pwBrowser(this, 'ChromiumHeadless', chromium, true, args, logger);
}

function FirefoxBrowser(args, logger, baseLauncherDecorator, captureTimeoutLauncherDecorator, retryLauncherDecorator) {
    applyDecorators(this, baseLauncherDecorator, captureTimeoutLauncherDecorator, retryLauncherDecorator);
    pwBrowser(this, 'Firefox', firefox, false, args, logger);
}

function FirefoxHeadlessBrowser(args, logger, baseLauncherDecorator, captureTimeoutLauncherDecorator, retryLauncherDecorator) {
    applyDecorators(this, baseLauncherDecorator, captureTimeoutLauncherDecorator, retryLauncherDecorator);
    pwBrowser(this, 'FirefoxHeadless', firefox, true, args, logger);
}

function WebKitBrowser(args, logger, baseLauncherDecorator, captureTimeoutLauncherDecorator, retryLauncherDecorator) {
    applyDecorators(this, baseLauncherDecorator, captureTimeoutLauncherDecorator, retryLauncherDecorator);
    pwBrowser(this, 'WebKit', webkit, false, args, logger);
}

function WebKitHeadlessBrowser(args, logger, baseLauncherDecorator, captureTimeoutLauncherDecorator, retryLauncherDecorator) {
    applyDecorators(this, baseLauncherDecorator, captureTimeoutLauncherDecorator, retryLauncherDecorator);
    pwBrowser(this, 'WebKitHeadless', webkit, true, args, logger);
}

module.exports = {
  'launcher:Chromium':         ['type', ChromiumBrowser],
  'launcher:ChromiumHeadless': ['type', ChromiumHeadlessBrowser],
  'launcher:Firefox':          ['type', FirefoxBrowser],
  'launcher:FirefoxHeadless':  ['type', FirefoxHeadlessBrowser],
  'launcher:WebKit':           ['type', WebKitBrowser],
  'launcher:WebKitHeadless':   ['type', WebKitHeadlessBrowser],
}
