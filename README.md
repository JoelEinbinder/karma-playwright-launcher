# karma-playwright-launcher

Provides six browsers to [Karma](https://karma-runner.github.io/):

* `Chromium`
* `ChromiumHeadless`
* `Firefox`
* `FirefoxHeadless`
* `WebKit`
* `WebKitHeadless`

The "real" Chrome, Edge or custom versions of the browsers can be configured by providing
[`launchOptions`](https://playwright.dev/docs/api/class-browsertype#browsertypelaunchoptions) in your Karma
configuration. The browsers must be downloaded and installed manually.

```js
    ...
    customLaunchers: {
        HeadlessEdge: {
            base: 'HeadlessChromium',
            displayName: 'HeadlessEdge',
            launchOptions: {
                channel: 'msedge'
            }
        }
    },

    browsers: [
        'HeadlessChromium',
        'HeadlessEdge',
        'HeadlessFirefox',
        'HeadlessWebKit',
    ],
    ...
```

Valid values for the `channel` option are: `chrome`, `chrome-beta`, `chrome-dev`, `chrome-canary`, `msedge`,
`msedge-beta`, `msedge-dev`, `msedge-canary`.

Powered by [playwright](https://github.com/microsoft/playwright).
