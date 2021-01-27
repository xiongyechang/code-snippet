<template>
	<div id="bottombar" ref="bottombar">
		<div class="opts">
            <span class="opt">
				<i class="iconfont" :class="[battery.icon]"></i>
                <span class="iconfont-title">{{ battery.number }}%</span>
			</span>
			<span class="opt">
				<i class="iconfont" :class="[network]"></i>
			</span>
			<span class="opt-minimize opt" @click.stop="goLoginPage">
				<i class="el-icon-user-solid"></i>
			</span>
		</div>
	</div>
</template>

<script>

    const NETWORK = {
        WIFI_ONLINE: 'icon-wifi-on-line',
        WIFI_OFFLINE: 'icon-wifi-off-line',
        NET_ONLINE: 'icon-online',
        ONLINE: 'online',
        OFFLINE: 'offline'
    }

    const BATTERY = {
        FULL: 'icon-battery-full',
        EMPTY: 'icon-battery-empty',
        CHARGING: 'icon-battery-charging'
    }

	export default {
		name: "bottombar",
		data() {
			return {
                navigator: window.navigator,
                network: NETWORK.WIFI_ONLINE,
                battery: {
                    icon: BATTERY.FULL,
                    number: 100
                }
            };
		},
		created() {    
            // const navigator = window.navigator;
            
            this.detectNetwork();

            const timer = setInterval(() => {
                this.detectBattery();
            }, 1000 * 60);

            this.$on('hook:beforeDestroy', () => {
                clearInterval(timer);
            })
		},
		methods: {

            setNetwork () {
                const connection = this.navigator.connection;
                const { effectiveType } = connection;
                if (effectiveType === '4g') {
                    this.network = NETWORK.NET_ONLINE
                } else if (effectiveType === 'wifi') {
                    this.network = NETWORK.WIFI_ONLINE
                }
            },

            detectNetwork () {
                this.setNetwork()

                window.addEventListener(NETWORK.OFFLINE, () => {
                    this.network = NETWORK.WIFI_OFFLINE
                });

                window.addEventListener(NETWORK.ONLINE, () => {
                    this.setNetwork()
                    this.network = NETWORK.WIFI_ONLINE
                });
            },
            detectBattery () {
                const battery = this.navigator.getBattery();
                battery.then(({ level }) => {
                    if (level >= 0.95) {
                        this.battery.icon = BATTERY.FULL;
                    } else if (level <= 0.20) {
                        this.battery.icon = BATTERY.EMPTY;
                    } else {
                        this.battery.icon = BATTERY.CHARGING;
                    }
                    this.battery.number = level * 100;
                })
            },
			goLoginPage() {
				this.$router.push({
					name: "login",
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	#bottombar {
		height: 33px;
		background: var(--primary-color);
		display: flex;
		justify-content: flex-end;
		align-items: center;
		-webkit-app-region: drag;
		.opts {
			height: 33px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
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
		}

		.opt-minimize,
		.opt-maximize,
		.opt-close {
			cursor: pointer;
			&:hover {
				background: red;
			}
		}

        .iconfont-title {
            font-size: 12px;
        }
	}
</style>
