import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store/store';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: process.env.IS_ELECTRON ? 'hash' : 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/login',
            name: 'login',
            meta: {
                title: '后台登录',
                keepAlive: false,
                requireAuth: false
            },
            components: {
                // 对应 <router-view name="blank"></router-view>
                blank: resolve => require(['@/views/login/login.vue'], resolve)
            }
        },
        {
            path: '',
            name: 'web',
            meta: {
                title: '主页',
                keepAlive: false,
                requireAuth: false
            },
            component: () => import(`@/views/web/web.vue`)
        },
        {
            path: '/admin',
            name: 'admin',
            meta: {
                title: '管理端',
                keepAlive: false,
                requireAuth: true
            },
            component: () => import(`@/views/admin/admin.vue`)
        },
        {
            path: '/form/:_id?',
            props: true,
            name: 'form',
            meta: {
                title: '表单',
                keepAlive: false,
                requireAuth: true
            },
            component: () => import(`@/components/form.vue`)
        }, 
        {
            path: "*",
            redirect: {
                name: 'admin'
            }
        }
    ]
});

router.beforeEach(function (to, from, next) {
    const requireAuth = to.meta.requireAuth;
    if (requireAuth) {
        const isLogin = store.state.admin.isLogin;
        if (isLogin) {
            next();
        } else {
            if (from.name !== 'login') {
                next({ name: 'login'});
            }
        }
    } else {
        next()
    }
})

export default router