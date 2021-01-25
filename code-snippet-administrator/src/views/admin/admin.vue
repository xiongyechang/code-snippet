<template>
    <div>
        <tree-table :treeData="treeData"></tree-table>
    </div>
</template>

<script>
import API from '@/api/api'
import TreeTable from '@/components/tree-table.vue'
import { HttpResponseCode } from '@/constants/constants';
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
            try {
                const { code, message, data } = await API.getCodeCategories();
                if (code === HttpResponseCode.OK) {
                    const { rows } = data;
                    this.treeData = rows.map(item => ({
                        ...item,
                        editable: false
                    }));
                } else {
                    this.$message.error(message);                    
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}
</script>