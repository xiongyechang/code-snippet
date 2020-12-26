import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [{
            path: '/login',
            name: 'login',
            meta: {
                title: '后台登录',
                keepAlive: false
            },
            components: {
                // 对应 <router-view name="blank"></router-view>
                blank: resolve => require(['@/views/login/login.vue'], resolve)
            }
        },
        {
            path: '/web',
            name: 'web',
            meta: {
                title: '主页',
                keepAlive: false
            },
            component: () => import(`@/views/web/web.vue`)
        },
        {
            path: '',
            name: 'admin',
            meta: {
                title: '管理端',
                keepAlive: false
            },
            component: () => import(`@/views/admin/admin.vue`)
        }
    ]
});

export default router