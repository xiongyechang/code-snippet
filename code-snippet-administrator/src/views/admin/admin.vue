<template>
    <div>
        <tree-table :treeData="treeData"></tree-table>
    </div>
</template>

<script>
import API from '@/api/api'
import TreeTable from '@/components/tree-table.vue'
export default {
    name: "admin",
    components: { TreeTable },
    data () {
        return {
            treeData: []
        }
    },
    created (){
        this.getCodeCategories();
    },
    methods: {
        async getCodeCategories () {
            const { count, rows } = await API.getCodeCategories();
            console.log(count, rows);
            this.treeData = rows.map(item => ({
                ...item,
                editable: false
            }));
        }
    }
}
</script>