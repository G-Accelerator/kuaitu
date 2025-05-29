<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-10-07 17:21:29
 * @Description: 组合与拆分组合
-->

<template>
  <div v-if="(isMultiple || isGroup) && !isTextImage" class="attr-item-box">
    <div class="bg-item">
      <!-- 组合按钮 多选时不可用 -->
      <Button v-if="isMultiple" long :disabled="!isMultiple" @click="group" type="text">
        <groupIcon width="14" height="14"></groupIcon>
        {{ $t('attrSeting.group') }}
      </Button>
      <!-- 拆分组合按钮，为单选且组元素时可用 -->
      <Button v-if="isGroup" long :disabled="!isGroup" @click="unGroup" type="text">
        <unGroupIcon width="14" height="14"></unGroupIcon>
        {{ $t('attrSeting.unGroup') }}
      </Button>
    </div>

    <!-- <Divider plain v-if="isGroup"></Divider> -->
  </div>
</template>

<script setup name="Group">
import useSelect from '@/hooks/select';
import groupIcon from '@/assets/icon/group/group.svg';
import unGroupIcon from '@/assets/icon/group/unGroup.svg';

const { isGroup, isMultiple, canvasEditor } = useSelect();
const extensionType = ref('');
// 定义 isTextImage，判断 extensionType 是否为 textImage
const isTextImage = computed(() => extensionType.value === 'textImage');
const selectedObject = ref(null); // 存储当前选中的对象

const getObjectAttr = () => {
  const activeObject = canvasEditor.canvas.getActiveObject();
  extensionType.value = activeObject?.extensionType || '';
};
// 拆分组
const unGroup = () => {
  canvasEditor.unGroup();
};
const group = () => {
  canvasEditor.group();
};
onMounted(() => {
  // 获取字体数据
  getObjectAttr();
  // canvasEditor.on('selectCancel', selectCancel);
  canvasEditor.on('selectOne', getObjectAttr);
  canvasEditor.canvas.on('selection:updated', getObjectAttr);
  canvasEditor.canvas.on('selection:cleared', () => {
    selectedObject.value = null; // 清空选中状态
    extensionType.value = ''; // 重置 extensionType
  });
});
onBeforeUnmount(() => {
  // 移除事件监听
  canvasEditor.off('selectOne', getObjectAttr);
  canvasEditor.canvas.off('selection:updated', getObjectAttr);
  canvasEditor.canvas.off('selection:cleared');

  // 清理全局状态
  selectedObject.value = null;
  extensionType.value = '';

  // 清理定时器或异步任务（如果有）
  // if (timer) clearTimeout(timer);

  console.log('组件已卸载，资源已清理');
});
</script>
<style scoped lang="less">
:deep(.ivu-btn) {
  &[disabled] {
    svg {
      opacity: 0.2;
    }
  }
}
</style>
