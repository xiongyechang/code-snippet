<template>
    <span class="opt-hover opt">
        <el-badge :value="message" :hidden="!updateAvailable">
            <i v-if="!updating" @click="update" class="iconfont icon-update"></i>
            <div v-else @dblclick="cancelUpdate" style="overflow: hidden;">
                <div class="move">
                    <span class="iblock">{{ progress }}%</span>
                    <span class="iblock update-rotate">
                        <i class="iconfont icon-update"></i>
                    </span>
                </div>
            </div>
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
            updating: false,
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

            if (!this.updating) {
                this.updating = true;
            }
            this.progress = (progress.percent.toFixed(2))
        });
    },
    methods: {
        update () {
            ipcRenderer.send(Update.IsUpdate, true);
            this.message = `双击取消更新`;
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
.update-rotate {
    transform: rotateX(180deg);
}

.move {
    animation: move 2s linear infinite;
    &:hover {
        animation-play-state: paused; // 暂停动画
    }
}

@keyframes move {
    0% {
        transform: translateY(-40px);
    }
    100% {
        transform: translateY(40px);
    }
}

.iblock {
    display: block;
    height: 33px;
    line-height: 33px;
}
</style>