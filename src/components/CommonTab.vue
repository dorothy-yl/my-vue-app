<script setup>

import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAllDateStore } from '@/stores'
const store = useAllDateStore()
const route = useRoute()
const router = useRouter()

const tags = computed(() => {
    //这个在下面配置
    return store.state.tags
})

const changeMenu = (tag) => {
    //单击tab时，联动面包屑
    store.selectMenu(tag)
    //跳转对应页面
    router.push(tag.name)
}

//关闭tab时触发
const handleClose = (tag, index) => {
    store.updateTags(tag)
    if (tag.name === 'route.home') return
    if (index === store.state.tags.length) {
        store.selectMenu(tags.value[index - 1])
        router.push(tags.value[index - 1].name)
    } else {
        store.selectMenu(tags.value[index])
        router.push(tags.value[index].name)
    }
}
</script>


<template>
    <div class="tags">
        <el-tag :key="tag.name" v-for="(tag, index) in tags" :closable="tag.name !== 'home'"
            :effect="route.name === tag.name ? 'dark' : 'plain'" @click="changeMenu(tag)"
            @close="handleClose(tag, index)">
            {{ tag.label }}
        </el-tag>
    </div>
</template>





<style lang="less" scoped>
.tags {
    margin: 20px 0 0 20px;
}

.el-tag {
    margin-right: 10px;
}
</style>
