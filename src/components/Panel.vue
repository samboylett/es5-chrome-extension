<template>
    <div class="panel">
        <i v-if="!requests.length">
            No requests captured
        </i>

        <i v-else-if="!erroredRequests.length">
            No JS files have errored in ES5
        </i>

        <div
            v-else
            class="control-bar"
        >
            <button
                @click="requests = []"
            >
                Clear
            </button>
        </div>

        <request-error
            v-for="request in erroredRequests"
            :key="request.key"
            :request="request"
        />
    </div>
</template>

<script>
    import RequestError from './RequestError.vue';
    import getES5Error from '../get-es5-error';
    import { devtoolsPort } from '../ports';
    import { tabUpdated } from '../messages';

    export default {
        name: 'panel',

        components: {
            RequestError,
        },

        data() {
            return {
                requests: [],
            };
        },

        computed: {
            erroredRequests() {
                return this.requests.filter(({ error }) => Boolean(error));
            },
        },

        mounted() {
            chrome.devtools.network.onRequestFinished.addListener(this.handleRequestFinished);
            devtoolsPort.onMessage.addListener(this.handleMessage);
        },

        methods: {
            async getTab() {
                return new Promise(r => {
                    chrome.tabs.get(chrome.devtools.inspectedWindow.tabId, r);
                });
            },

            handleMessage({ type, data }) {
                const handler = {
                    [tabUpdated]: this.handleTabUpdated,
                }[type];

                if (handler) {
                    handler(data);
                }
            },

            handleTabUpdated({ tabId }) {
                if (tabId !== chrome.devtools.inspectedWindow.tabId) {
                    return;
                }

                this.analyseInspectedWindow();
            },

            handleRequestFinished(request) {
                const url = new URL(request.request.url);

                if (!url.pathname.endsWith('.js')) {
                    return;
                }

                request.getContent(body => {
                    this.analyseScript({
                        href: url.href,
                        body,
                        pathname: url.pathname,
                    });
                });
            },

            async analyseInspectedWindow() {
                const tab = await this.getTab();

                chrome.devtools.inspectedWindow.eval(`
                    Array.from(document.querySelectorAll('script[type="text/javascript"]'))
                        .map(s => s.innerHTML)
                        .filter(t => t);
                `, result => {
                    result.forEach(script => {
                        this.analyseScript({
                            href: tab.url,
                            body: script,
                            pathname: 'Content script',
                        });
                    });
                });
            },

            async analyseScript({ href, body, pathname }) {
                const parsedRequest = {
                    href,
                    body,
                    key: [href, new Date().getTime()].join('-'),
                    error: getES5Error(body),
                };

                this.requests = [
                    ...this.requests,
                    parsedRequest,
                ];

                if (parsedRequest.error) {
                    chrome.devtools.inspectedWindow.eval(`
                        console.error('ES5 Analyser found an issue with ${ pathname }');
                    `);
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    i {
        padding: 8px;
        font-size: 14px;
    }

    .control-bar {
        background: rgba(255, 255, 255, 0.05);
        padding: 4px;
    }
</style>
