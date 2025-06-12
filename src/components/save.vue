<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-11 15:49:01
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-04-10 14:33:18
 * @Description: 保存文件
-->

<template>
  <div class="save-box">
    <Button style="margin-left: 10px" type="text" @click="beforeClear">
      {{ $t('save.empty') }}
    </Button>
    <Dropdown style="margin-left: 10px" @on-click="saveWith">
      <Button type="primary">
        {{ $t('save.down') }}
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <template #list>
        <DropdownMenu>
          <DropdownItem name="saveMyClould">{{ $t('save.save_my_spase') }}</DropdownItem>
          <DropdownItem name="saveImg" divided>{{ $t('save.save_as_picture') }}</DropdownItem>
          <DropdownItem name="saveSvg">{{ $t('save.save_as_svg') }}</DropdownItem>
          <DropdownItem name="clipboard" divided>{{ $t('save.copy_to_clipboard') }}</DropdownItem>
          <DropdownItem name="clipboardBase64">{{ $t('save.copy_to_clipboardstr') }}</DropdownItem>
          <DropdownItem name="saveJson" divided>{{ $t('save.save_as_json') }}</DropdownItem>
          <DropdownItem name="uploadServer" divided>上传到服务器</DropdownItem>
          <DropdownItem name="uploadRecords">上传记录</DropdownItem>
        </DropdownMenu>
      </template>
    </Dropdown>
    <Modal
      v-model="uploadRecordsVisible"
      title="上传记录"
      footer-hide
      :style="{ minWidth: '1000px' }"
    >
      <Spin :size="'large'" v-if="loading" fix />
      <div class="grid-container" v-if="uploadRecords.length > 0">
        <Card
          v-for="(record, index) in uploadRecords"
          :key="index"
          class="upload-card"
          @click="onCardClick(record)"
        >
          <img :src="record.img" alt="预览图" class="preview-img" loading="lazy" />
          <div class="card-content">
            <p>上传时间：</p>
            <p>{{ formatTimestamp(record.time) }}</p>
          </div>
        </Card>
      </div>
      <div v-else class="empty-placeholder">
        <p>暂无上传记录</p>
      </div>
      <div style="text-align: center; margin-top: 20px">
        <Page
          show-sizer
          show-total
          :total="totalRecords"
          :page-size="pageSize"
          v-model:current="currentPage"
          @on-change="uploadPage"
          @on-page-size-change="uploadPageSize"
          :page-size-opts="[5, 10]"
        />
      </div>
    </Modal>
  </div>
</template>

<script setup name="save-bar">
import { Modal, Page } from 'view-ui-plus';
import useSelect from '@/hooks/select';
import useMaterial from '@/hooks/useMaterial';
import { debounce } from 'lodash-es';
import { useI18n } from 'vue-i18n';
import { Spin } from 'view-ui-plus';
import { useRoute, useRouter } from 'vue-router';
import { Message } from 'view-ui-plus';
import { postSnapshot, fetchSnapshotList } from '@/api/textImage';
import dayjs from 'dayjs';
const route = useRoute();
const router = useRouter();
const { createTmplByCommon, updataTemplInfo, routerToId } = useMaterial();

const { t } = useI18n();

const { canvasEditor } = useSelect();
const uploadRecordsVisible = ref(false); // 控制弹窗显示
const uploadRecords = ref([]); // 存储上传记录数据
const currentPage = ref(1); // 当前页码
const totalRecords = ref(0); // 总记录数
const pageSize = ref(5); // 每页显示的记录数
const loading = ref(false); // 控制加载状态
function formatTimestamp(timestamp) {
  // 使用 dayjs 格式化时间戳
  return dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss');
}
const cbMap = {
  async clipboard() {
    try {
      await canvasEditor.clipboard();
      Message.success('复制成功');
    } catch (error) {
      Message.error('复制失败');
    }
  },
  saveJson() {
    canvasEditor.saveJson();
  },
  saveSvg() {
    canvasEditor.saveSvg();
  },
  saveImg() {
    canvasEditor.saveImg();
  },
  async clipboardBase64() {
    try {
      await canvasEditor.clipboardBase64();
      Message.success('复制成功');
    } catch (error) {
      Message.error('复制失败');
    }
  },
  async saveMyClould() {
    try {
      Spin.show();
      if (route?.query?.id) {
        await updataTemplInfo(route?.query?.id);
      } else {
        const res = await createTmplByCommon();
        routerToId(res.data.data.id);
      }
    } catch (error) {
      Message.warning('请登录');
    }
    Spin.hide();
  },
  // 上传到服务器
  async uploadServer() {
    // 打开 Modal 对话框
    Modal.confirm({
      title: '上传服务器',
      content: `
      <p>请确认是否将当前内容上传到服务器？</p>
    `,
      okText: '确认上传',
      cancelText: '取消',
      onOk: async () => {
        try {
          Spin.show();

          // 获取当前视图变换状态
          const originalTransform = canvasEditor.canvas.viewportTransform;

          // 获取工作区对象
          const workspace = canvasEditor.canvas.getObjects().find((obj) => obj.id === 'workspace');
          if (!workspace) {
            Message.error('未找到可编辑区域');
            return;
          }

          // 获取工作区的尺寸和位置
          const { left, top, width, height } = workspace;
          const option = {
            format: 'png', // 设置导出格式
            quality: 1, // 设置图片质量
            width,
            height,
            left,
            top,
          };

          // 重置视图变换
          canvasEditor.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

          // 导出工作区的 Base64 图片数据
          const imgBase64 = canvasEditor.canvas.toDataURL(option);

          console.log('imgBase64', imgBase64);

          // 恢复视图变换
          canvasEditor.canvas.setViewportTransform(originalTransform);

          const postData = {
            temp_id: route?.query?.tempId ? route?.query?.tempId : null,
            img_base64: imgBase64, // 设置为可编辑区的图片数据
            json_config: JSON.stringify(getCanvasJson()), // 保存画布的 JSON 配置
          };

          console.log('postData', postData);

          // 上传
          const result = await postSnapshot(postData);
          console.log('result', result);

          if (result.data.code === 0) {
            Message.success('上传成功');
          } else {
            Message.error('上传失败，请稍后再试');
          }
        } catch (error) {
          Message.error('上传失败，请稍后再试');
        } finally {
          Spin.hide();
        }
      },
    });
  },
  // 上传记录
  async uploadRecords() {
    uploadRecordsVisible.value = true; // 显示弹窗
    currentPage.value = 1; // 重置当前页码为1
    pageSize.value = 5; // 重置每页记录数
    totalRecords.value = 0; // 重置总记录数
    uploadRecords.value = []; // 清空上传记录
    fetchPageData(currentPage.value, pageSize.value, true); // 加载第一页数据
  },
};
// 得到画布的 JSON 配置
const getCanvasJson = () => {
  const keys = [
    'id',
    'gradientAngle',
    'selectable',
    'hasControls',
    'linkData',
    'editable',
    'extensionType',
    'extension',
    'verticalAlign',
    'roundValue',
  ];
  return canvasEditor.canvas.toJSON(keys);
};
// 缓存分页数据
const pageCache = new Map();
// 获取分页数据------ 定义防抖函数，避免频繁调用
async function fetchPageData(page, size, forceUpdate = false) {
  const cacheKey = `${page}-${size}`; // 缓存的唯一键
  if (!forceUpdate && pageCache.has(cacheKey)) {
    // 如果缓存中有数据，直接使用缓存
    uploadRecords.value = pageCache.get(cacheKey);
    console.log('从缓存中加载数据:', uploadRecords.value);
    return;
  }

  try {
    loading.value = true; // 显示加载状态
    const result = await fetchSnapshotList({
      page_index: page - 1, // 当前页码（后端从 0 开始）
      page_size: size, // 每页记录数
    });

    if (result.data.code === 0) {
      // 更新数据和总记录数
      uploadRecords.value = result.data.data.snapshots;
      totalRecords.value = result.data.data.total;

      // 缓存数据
      pageCache.set(cacheKey, result.data.data.snapshots);

      console.log('从接口加载数据:', uploadRecords.value);
    } else {
      Message.error('获取上传记录失败，请稍后再试');
    }
  } catch (error) {
    console.error('获取上传记录失败:', error);
    Message.error('获取上传记录失败，请稍后再试');
  } finally {
    loading.value = false; // 隐藏加载状态
  }
}
// 切换页码时
const uploadPage = (page) => {
  currentPage.value = page; // 更新当前页码
  fetchPageData(page, pageSize.value);
};
// 更新页大小时
const uploadPageSize = (size) => {
  pageSize.value = size; // 更新每页记录数
  currentPage.value = 1; // 重置当前页码为1
  fetchPageData(currentPage.value, size);
};
// 处理卡片点击事件
const onCardClick = (record) => {
  Modal.confirm({
    title: t('tip'),
    content: `<p>确认恢复吗？</p>`,
    okText: t('ok'),
    cancelText: t('cancel'),
    onOk: () => renderToCanvas(record),
  });
};
// 利用json渲染画布，更新路由
const renderToCanvas = (record) => {
  try {
    canvasEditor.loadJSON(record.json_config, () => {
      canvasEditor.canvas.renderAll(); // 渲染画布
    });
    // 根据 temp_id 更新路由
    if (record.temp_id) {
      console.log('模板 ID:', record.temp_id);
      // 例如：更新路由或其他逻辑
      router.push({ query: { ...route.query, tempId: record.temp_id } }); // 更新路由
    }
  } catch (error) {
    console.error('加载画布失败:', error);
    Message.error('加载画布失败，请检查数据格式');
  } finally {
    uploadRecordsVisible.value = false; // 关闭弹窗
  }
};
const saveWith = debounce(function (type) {
  cbMap[type] && typeof cbMap[type] === 'function' && cbMap[type]();
}, 300);

/**
 * @desc clear canvas 清空画布
 */
const clear = () => {
  canvasEditor.clear();
  canvasEditor.canvas.clearHistory(false);
  canvasEditor.historyUpdate();
};

const beforeClear = () => {
  Modal.confirm({
    title: t('tip'),
    content: `<p>${t('clearTip')}</p>`,
    okText: t('ok'),
    cancelText: t('cancel'),
    onOk: () => clear(),
  });
};
</script>

<style scoped lang="less">
.save-box {
  display: inline-block;
  padding-right: 10px;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px; // 卡片之间的间距
  justify-items: center; // 居中对齐
}

.upload-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  background-color: #f0f0f083; /* 添加背景色以区分图片边界 */
}

.preview-img {
  width: 100%;
  height: 150px;
  object-fit: contain; /* 保持图片原比例，显示完整内容 */
}

.card-content {
  padding: 10px;
}
.empty-placeholder {
  text-align: center;
  color: #999;
  font-size: 16px;
  padding: 20px;
}
/* 模态框动画 */
.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.modal-slide-enter-from,
.modal-slide-leave-to {
  transform: translateY(-20px); /* 从上方滑入 */
  opacity: 0;
}
.modal-slide-enter-to,
.modal-slide-leave-from {
  transform: translateY(0); /* 回到原位 */
  opacity: 1;
}

/* 背景动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
}
</style>
