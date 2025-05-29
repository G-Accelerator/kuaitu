<template>
  <div class="box attr-item-box" v-if="isOne && isGroup && isTextImage">
    <Divider plain orientation="left">
      <h4>图片文字组属性</h4>
    </Divider>
    <div class="flex-view">
      <p>内容</p>
      <span class="flex-item">
        <Input
          v-model="text"
          placeholder="请输入文字..."
          style="width: 95%; margin: 0 auto; margin-right: 1px"
        ></Input>
      </span>
    </div>
    <div class="flex-view">
      <p>图片排版</p>
      <RadioGroup v-model="layout" type="button" style="width: 200px">
        <Radio :label="0" style="width: 100px">横排版</Radio>
        <Radio :label="1" style="width: 100px">竖排版</Radio>
      </RadioGroup>
    </div>
    <!-- 字体类型与字体大小 -->
    <div class="flex-view">
      <div class="flex-item">
        <div class="left font-selector">
          <Select v-model="id" placeholder="请选择字体类型" not-found-text="获取数据失败">
            <Option v-for="item in modelList" :value="item.id" :key="item.id">
              <div class="font-item" :style="`background-image:url('${item.perview}');`">
                {{ !item.perview ? item : '' }}
                <span style="display: none">{{ item.name }}</span>
              </div>
            </Option>
          </Select>
        </div>
        <div class="right">
          <InputNumber v-model="imgSize" append="图幅" :min="1"></InputNumber>
        </div>
      </div>
    </div>
    <!-- 字体颜色 -->
    <div>
      <Row :gutter="12">
        <Col flex="1">
          <div class="ivu-col__box">
            <span class="label">字体颜色</span>
            <div class="content">
              <ColorPicker v-model="color" alpha transfer></ColorPicker>
            </div>
          </div>
        </Col>
      </Row>
    </div>
    <!-- 边框 -->
    <div>
      <Row :gutter="12">
        <Col flex="1">
          <div class="ivu-col__box">
            <span class="label">边框颜色</span>
            <div class="content">
              <ColorPicker v-model="stroke.color" alpha />
            </div>
          </div>
        </Col>
        <Col flex="1">
          <InputNumber v-model="stroke.width" append="宽度" :min="0"></InputNumber>
        </Col>
      </Row>

      <Row :gutter="12">
        <Col flex="1">
          <div class="ivu-col__box">
            <span class="label">边框类型</span>
            <div class="content">
              <Select v-model="stroke.type">
                <Option
                  v-for="item in strokeDashList"
                  :value="item.label"
                  :key="`stroke-${item.label}`"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </div>
          </div>
        </Col>
      </Row>
    </div>
    <!-- 提交按钮 -->
    <div class="flex-view">
      <div class="flex-item">
        <Button @click="updateGroupContent" type="primary" style="width: 100%">确认修改</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import InputNumber from '@/components/inputNumber';
import { Spin } from 'view-ui-plus';
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import useSelect from '@/hooks/select';
import axios from 'axios';
const { fabric, canvasEditor, isOne, isGroup } = useSelect();

const text = ref(''); // 输入的文字
const imgSize = ref(128); // 图片大小
const layout = ref(0); // 图片排版
const id = ref(''); // 选择的id
const color = ref('rgba(0,0,0,1)'); // 字体颜色
const stroke = reactive({
  color: 'rgba(0,0,0,0)',
  width: 0,
  type: '',
}); // 边框信息
// 边框种类
const strokeDashList = [
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [],
      strokeLineCap: 'butt',
    },
    label: 'Stroke',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 10],
      strokeLineCap: 'butt',
    },
    label: 'Dash-1',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 10],
      strokeLineCap: 'round',
    },
    label: 'Dash-2',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [15, 15],
      strokeLineCap: 'square',
    },
    label: 'Dash-3',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [15, 15],
      strokeLineCap: 'round',
    },
    label: 'Dash-4',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [25, 25],
      strokeLineCap: 'square',
    },
    label: 'Dash-5',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [25, 25],
      strokeLineCap: 'round',
    },
    label: 'Dash-6',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 8, 16, 8, 1, 20],
      strokeLineCap: 'square',
    },
    label: 'Dash-7',
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 8, 16, 8, 1, 20],
      strokeLineCap: 'round',
    },
    label: 'Dash-8',
  },
];
const extensionType = ref('');
// 定义 isTextImage，判断 extensionType 是否为 textImage
const isTextImage = computed(() => extensionType.value === 'textImage');
const selectedObject = ref(null); // 存储当前选中的对象
const getObjectAttr = () => {
  const activeObject = canvasEditor.canvas.getActiveObject();
  extensionType.value = activeObject?.extensionType || '';
  if (activeObject && activeObject?.extensionType === 'textImage') {
    const { sentence } = activeObject;
    text.value = sentence || '';
    // console.log('activeObject', activeObject);
    // console.log('text.value', text.value);
  }
};
const modelList = ref([]); // 字体类型列表
// 获取 modelList 数据
const fetchModelList = async () => {
  try {
    const response = await axios.get('http://10.1.10.180:49120/api/fonttools/remake/demo/imgfonts');
    // console.log('获取 modelList 数据成功:', response.data);

    modelList.value = response.data.data;
    // console.log('modelList', modelList.value);
  } catch (error) {
    console.error('获取 modelList 数据失败:', error);
  }
};
let isUpdating = false; // 状态锁
// 更新组内容的函数
const updateGroupContent = async () => {
  if (isUpdating) {
    console.warn('操作正在进行中，请稍候...');
    return;
  }
  isUpdating = true; // 设置状态锁
  Spin.show(); // 显示加载动画
  try {
    // 获取选中的组对象
    const activeObject = canvasEditor.canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'group') {
      console.error('请先选中一个组对象');
      return;
    }

    const group = activeObject;

    //接口参数
    const postData = {
      font_id: id.value || 'STONE202411060002HAN003',
      chars: text.value, // 输入的文字
      img_size: imgSize.value || 128, // 图片大小
      layout: layout.value || 0, // 0 代表横排版，1 代表竖排版
      color: color.value || 'rgba(0,0,0,1)', //#字体RGBA颜色 , 默认为 纯黑
      stroke: {
        color: stroke.color || 'rgba(0,0,0,0)', // 边框颜色
        width: stroke.width || 0, // 边框宽度
        type: stroke.type || '', // 边框类型
      },
    };
    console.log('请求数据:', postData);

    // 调用接口获取数据
    let response;
    try {
      response = await axios.post(
        'http://10.1.10.180:49120/api/fonttools/remake/demo/imgfont/glyphs',
        postData
      );
    } catch (error) {
      console.error('接口请求失败:', error);
      return; // 如果接口请求失败，直接退出
    }

    // 验证接口返回的数据
    if (!response || !response.data || !response.data.data) {
      console.error('接口返回的数据无效:', response);
      return; // 如果数据无效，直接退出
    }
    const glyphsData = response.data.data;
    // console.log('接口返回的数据:', glyphsData);

    const { char_glyph_dict, chars, layout_data } = glyphsData;

    // 创建新的图片文字对象
    const imageObjects = [];
    const charsArray = chars.split('');
    let loadedImages = 0; // 记录已加载的图片数量

    // 保存组的位置信息
    const { left, top, scaleX, scaleY } = group;

    // 清空组内的内容
    const objectsToRemove = group._objects;
    objectsToRemove.forEach((obj) => canvasEditor.canvas.remove(obj));
    group._objects.length = 0; // 清空组的子对象数组
    // 根据 chars 动态生成布局数据
    const filteredLayoutData = charsArray.map((char, index) => {
      const layout = layout_data[index]; // 按 chars 的顺序取 layout_data
      return {
        char,
        x_offset: layout?.x_offset || index * 115.2, // 如果 layout_data 中没有对应数据，动态计算 x_offset
        y_offset: layout?.y_offset || 0, // 如果 layout_data 中没有对应数据，默认 y_offset 为 0
        z_index: layout?.z_index || index, // 如果 layout_data 中没有对应数据，按顺序设置 z_index
      };
    });

    // 如果没有字符，直接返回
    if (charsArray.length === 0) {
      console.error('没有字符数据可处理');
      return;
    }

    // 为每个字符寻找图片对象
    filteredLayoutData.forEach((layout) => {
      const charData = char_glyph_dict[layout.char];
      if (!charData) {
        console.warn(`字符 "${layout.char}" 没有对应的图片数据`);
        // 增加已加载计数，即使没有图片数据
        if (++loadedImages === charsArray.length) {
          createNewGroup();
        }
        return;
      }

      fabric.Image.fromURL(
        charData.img,
        (img) => {
          img.set({
            id: charData.id,
            font_id: postData.font_id,
            name: charData.char,
            left: layout.x_offset, // 使用动态生成的 x_offset
            top: layout.y_offset, // 使用动态生成的 y_offset
            scaleX: 1, // 缩放比例
            scaleY: 1, // 缩放比例
            imgSize: imgSize.value, // 图片大小
            extensionType: 'fontImage', // 扩展类型
          });
          imageObjects.push(img);
          // 检查是否所有图片都已加载完成
          if (++loadedImages === charsArray.length) {
            createNewGroup();
          }
        },
        {
          // 错误处理
          onError: (e) => {
            console.error(`加载字符 "${layout.char}" 的图片失败`, e);
            // 即使加载失败，也增加计数，避免无限等待
            if (++loadedImages === charsArray.length) {
              createNewGroup();
            }
          },
        }
      );
    });

    // 创建新组的函数
    const createNewGroup = () => {
      // 如果没有有效的图片对象，就不创建组
      if (imageObjects.length === 0) {
        console.error('没有有效的图片对象可用于创建组');
        return;
      }

      const newGroup = new fabric.Group(imageObjects, {
        left, // 保留原组的位置信息
        top,
        scaleX,
        scaleY, // 保持原组的缩放比例
        selectable: true,
        subTargetCheck: false,
      });

      // 更新组的自定义属性
      newGroup.set({
        sentence: postData.chars, // 更新句子
        extensionType: 'textImage', // 更新扩展类型
      });

      // 替换画布上的旧组
      canvasEditor.canvas.remove(group);
      canvasEditor.canvas.add(newGroup);
      canvasEditor.canvas.setActiveObject(newGroup); // 选中新组
      canvasEditor.canvas.renderAll();
      // Spin.show(); // 显示加载动画
      // console.log('组内容已成功更新');
    };
  } catch (error) {
    console.error('更新组内容失败:', error);
  } finally {
    isUpdating = false; // 释放状态锁
    Spin.hide(); // 隐藏加载动画
  }
};
onMounted(() => {
  // 获取字体数据
  getObjectAttr();
  fetchModelList();
  // canvasEditor.on('selectCancel', selectCancel);
  canvasEditor.on('selectOne', getObjectAttr);
  canvasEditor.canvas.on('selection:updated', getObjectAttr);
  canvasEditor.canvas.on('selection:cleared', () => {
    selectedObject.value = null; // 清空选中状态
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

<style lang="less" scoped>
:deep(.ivu-input-number) {
  display: block;
  width: 100%;
}

:deep(.ivu-color-picker) {
  display: block;
}
.ivu-row {
  margin-bottom: 8px;
  .ivu-col {
    position: inherit;
    &__box {
      display: flex;
      align-items: center;
      background: #f8f8f8;
      border-radius: 4px;
      gap: 8px;
    }
  }

  .label {
    padding-left: 8px;
  }
  .content {
    flex: 1;
    :deep(.--input),
    :deep(.ivu-select-selection) {
      background-color: transparent;
      border: none !important;
      box-shadow: none !important;
    }
  }
}
.font-selector {
  max-width: calc(100% - 120px); /* 限制最大宽度，避免挤占 .right 的空间 */
  :deep(.ivu-select-item) {
    padding: 1px 4px;
  }
  :deep(.ivu-select) {
    width: 140px;
  }

  .font-item {
    height: 40px;
    width: 280px;
    background-size: auto 35px;
    background-repeat: no-repeat;
  }
}

.flex-view {
  width: 100%;
  margin-bottom: 5px;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  background: #f6f7f9;
}
.flex-item {
  display: inline-flex;
  flex: 1;

  .content {
    flex: 1;
    // width: 60px;
  }

  .left {
    flex: 1;
    max-width: 50%; /* 限制最大宽度，避免挤占 .right 的空间 */
  }
  .right {
    flex: 1;
    margin-left: 10px;
    :deep(.ivu-input-number) {
      display: block;
      width: 100%;
    }
  }
}
</style>
