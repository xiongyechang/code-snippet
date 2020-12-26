<template>
    <div class="code-snippet-wrap">
        <div class="code-snippet-panel"></div>
        <div class="code-snippet">
            <div v-for="(item) of data" :key="item._id" @click="itemClicked(item)" class="code-snippet-item">
                <div class="code-snippet-logo">
                    <img :src="item.avatar" height="36" width="36">
                </div>
                <div>
                    <div class="code-snippet-title">{{ item.title }}</div>
                    <div class="code-snippet-summary">{{ item.summary }}</div>
                </div>
                <div class="code-snippet-modifier">
                    <div>2020-12-20</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'code-snippet-list',
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        itemClicked (item) {
            console.log(item);
            this.$emit("row-clicked", item);
        }
    }
}
</script>

<style lang="scss" scoped>
.code-snippet-wrap {
    height: 100vh;
}

.code-snippet-panel {
    height: 200px;
}

.code-snippet {
    height: calc(100vh - 200px);
    overflow: auto;
    &-item {
        display: grid;
        grid-template-columns: 60px 1fr 120px;
        overflow: hidden;
        border-bottom: 1px solid lightgray;
        padding: 5px 0;

        &:first-child {
            border-top: 1px solid lightgray;
        }

        &:hover {
            background: #e6e6e6;
            cursor: pointer;
        }
    }

    &-logo {
        display: grid;
        place-items: center;
    }

    &-title {
        margin-top: 5px;
    }

    &-summary {
        margin: 5px 0;
        font-size: 14px;
        color: lightgray;
        line-height: 14px;
        height: 28px;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    &-modifier {
        padding: 5px 0 0 5px;
    }
}
</style>