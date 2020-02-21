<template>
    <div class="request-error">
        <p>Error: {{ request.error.message }}</p>
        <p class="tabbed">
            <a
                :href="request.href"
                target="_BLANK"
            >{{ request.href }}</a>:{{ request.error.loc.line }}:{{ request.error.loc.column }}
        </p>
        <p class="tabbed">
            <span class="code">
                {{ code.before }}<strong>{{ code.char }}</strong>{{ code.end }}
            </span>
        </p>
    </div>
</template>

<script>
    const MAX_DISTANCE = 100;

    export default {
        name: 'request-error',

        props: {
            request: {
                type: Object,
                required: true,
            },
        },

        computed: {
            line() {
                return this.request.body.split('\n')[this.request.error.loc.line - 1];
            },

            codeStart() {
                return Math.max(0, this.request.error.loc.column - MAX_DISTANCE);
            },

            codeEnd() {
                return Math.min(this.request.error.loc.column + MAX_DISTANCE, this.line.length);
            },

            code() {
                return {
                    before: this.line.slice(this.codeStart, this.request.error.loc.column),
                    char: this.line[this.request.error.loc.column],
                    end: this.line.slice(this.request.error.loc.column, this.codeEnd),
                };
            },
        },
    };
</script>

<style lang="scss" scoped>
    .request-error {
        padding: 8px;
        margin-bottom: 3px;
        background: rgba(200, 30, 30, 0.3);

        p {
            margin: 0;

            &:not(:last-child) {
                margin-bottom: 3px;
            }

            &.tabbed {
                margin-left: 15px;
            }
        }

        .code {
            background: #222;
            display: inline-block;
            padding: 2px;

            strong {
                display: inline-block;
                border-bottom: 3px solid #eee;
                padding-bottom: 2px;
            }
        }

        a {
            color: inherit;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }
</style>
