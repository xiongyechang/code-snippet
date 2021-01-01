<template>
    <div class="code-category">
        <img :src="data.avatar" width="auto" height="60%">
        <span class="segment"></span>
        <span>{{ data.title }}</span>
    </div>
</template>

<script>
export default {
    name: 'code-category',
    props: {
        data: Object
    }
}
</script>

<style lang="scss" scoped>
.code-category {
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
}

.segment {
    width: 10px;
}
</style>