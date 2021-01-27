import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: process.env.IS_ELECTRON ? 'hash' : 'history',
    base: process.env.BASE_URL,
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
            path: '',
            name: 'web',
            meta: {
                title: '主页',
                keepAlive: false
            },
            component: () => import(`@/views/web/web.vue`)
        },
        {
            path: '/admin',
            name: 'admin',
            meta: {
                title: '管理端',
                keepAlive: false
            },
            component: () => import(`@/views/admin/admin.vue`)
        },
        {
            path: '/form/:_id?',
            props: true,
            name: 'form',
            meta: {
                title: '表单',
                keepAlive: false
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

// router.beforeEach(function (to, from, next) {
    
//     if(to.path === '/login') {

//     }
    
//     next()
// })

export default router