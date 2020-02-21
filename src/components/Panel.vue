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
        },

        methods: {
            handleRequestFinished(request) {
                const url = new URL(request.request.url);

                if (!url.pathname.endsWith('.js')) {
                    return;
                }

                request.getContent(body => {
                    this.requests = [
                        ...this.requests,
                        {
                            href: url.href,
                            body,
                            key: [url.href, new Date().getTime()].join('-'),
                            error: getES5Error(body),
                        },
                    ];
                });
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
