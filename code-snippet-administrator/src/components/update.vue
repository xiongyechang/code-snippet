<template>
    <span class="opt-hover opt">
        <el-badge :value="message" :hidden="!updateAvailable">
            <i @click="update" @dblclick="cancelUpdate" class="iconfont icon-update"></i>
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
            updateAvailable: false,
            message: `有更新啦`,
            progress: 0
        }
    },
    mounted () {
        // 检查是否有更新
        ipcRenderer.send(Update.CheckForUpdate);

        // 有更新
        ipcRenderer.on(Update.IsUpdate, () => {
            this.updateAvailable = true;
        });

        // 正在更新
        ipcRenderer.on(Update.DownloadProgress, (event, progress) => {
            console.log(progress)
            this.progress = (progress.percent.toFixed(2))
        });
    },
    methods: {
        update () {
            ipcRenderer.send(Update.IsUpdate, true);
        },
        cancelUpdate () {
            ipcRenderer.send(Update.CancelUpdate, true); 
        }
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