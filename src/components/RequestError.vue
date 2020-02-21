<template>
    <div class="request-error">
        <p>Error: {{ request.error.message }}</p>
        <p class="tabbed">
            {{ request.href }}:{{ request.error.loc.line }}:{{ request.error.loc.column }}
        </p>
    </div>
</template>

<script>
    export default {
        name: 'request-error',

        props: {
            request: {
                type: Object,
                required: true,
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
    }
</style>
