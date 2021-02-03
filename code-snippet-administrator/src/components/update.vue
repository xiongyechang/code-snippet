<template>
    <span class="opt-hover opt">
        <el-badge value="有更新啦" :hidden="!updateAvailable">
            <i class="iconfont icon-update"></i>
        </el-badge>
    </span>
</template>

<script>
import { ipcRenderer } from "electron";
import { Update } from '@/constants/constants';
export default {
    name: 'update',
    data(){
        return {
            updateAvailable: false
        }
    },
    mounted () {
        // 检查是否有更新
        ipcRenderer.send(Update.CheckForUpdate);

        // 有更新
        ipcRenderer.on(Update.IsUpdate, () => {
            // console.log(event)
            this.updateAvailable = true;
        });

    }
}
</script>

<style lang="scss" scoped>
.opt {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 33px;
    line-height: 33px;
    padding: 0 10px;
    text-align: center;
    color: #fff;
    -webkit-app-region: no-drag;
}
.opt-hover {
    cursor: pointer;
    &:hover {
        background: red;
    }
}
</style>