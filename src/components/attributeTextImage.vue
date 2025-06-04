<template>
  <div class="box attr-item-box" v-if="isOne && isGroup && isTextImage">
    <Divider plain orientation="left">
      <h4>图片文字组属性</h4>
    </Divider>
    <div class="flex-view">
      <p>内容</p>
      <span class="flex-item">
        <Input
          v-model="selectedGroupAttributes.sentence"
          placeholder="请输入文字..."
          style="width: 95%; margin: 0 auto; margin-right: 1px"
        ></Input>
      </span>
    </div>
    <div class="flex-view">
      <p>图片排版</p>
      <RadioGroup v-model="selectedGroupAttributes.layout" type="button" style="width: 200px">
        <Radio :label="0" style="width: 100px">横排版</Radio>
        <Radio :label="1" style="width: 100px">竖排版</Radio>
      </RadioGroup>
    </div>
    <!-- 字体类型与字体大小 -->
    <div>
      <Row :gutter="12">
        <Col flex="1">
          <div class="ivu-col__box">
            <span class="label">字体类型</span>
            <div class="content font-selector">
              <Select
                v-model="selectedGroupAttributes.fontId"
                placeholder="请选择字体类型"
                not-found-text="获取数据失败"
              >
                <Option v-for="item in fontIdList" :value="item.id" :key="item.id">
                  <div class="font-item" :style="`background-image:url('${item.perview}');`">
                    {{ !item.perview ? item : '' }}
                    <span style="display: none">{{ item.name }}</span>
                  </div>
                </Option>
              </Select>
            </div>
          </div>
        </Col>
      </Row>
    </div>
    <!-- <div class="flex-view">
      <div class="flex-item">
        <div class="font-selector">
          <Select
            v-model="selectedGroupAttributes.fontId"
            placeholder="请选择字体类型"
            not-found-text="获取数据失败"
          >
            <Option v-for="item in fontIdList" :value="item.id" :key="item.id">
              <div class="font-item" :style="`background-image:url('${item.perview}');`">
                {{ !item.perview ? item : '' }}
                <span style="display: none">{{ item.name }}</span>
              </div>
            </Option>
          </Select>
        </div>
        <div class="right">
          <InputNumber
            v-model="selectedGroupAttributes.imgSize"
            append="图幅"
            :min="1"
          ></InputNumber>
        </div>
      </div>
    </div> -->
    <!-- 字体颜色 -->
    <div>
      <Row :gutter="12">
        <Col flex="1">
          <div class="ivu-col__box">
            <span class="label">字体颜色</span>
            <div class="content">
              <ColorPicker v-model="selectedGroupAttributes.color" alpha transfer></ColorPicker>
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
              <ColorPicker v-model="selectedGroupAttributes.stroke.color" alpha />
            </div>
          </div>
        </Col>
        <Col flex="1">
          <InputNumber
            v-model="selectedGroupAttributes.stroke.width"
            append="宽度"
            :min="0"
          ></InputNumber>
        </Col>
      </Row>

      <Row :gutter="12">
        <Col flex="1">
          <div class="ivu-col__box">
            <span class="label">边框类型</span>
            <div class="content">
              <Select v-model="selectedGroupAttributes.stroke.type">
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
        <Button
          @click="updateGroupContent"
          type="primary"
          style="width: 100%"
          :disabled="!selectedGroupAttributes.sentence"
        >
          {{ selectedGroupAttributes.sentence ? '确认修改' : '请先输入内容' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import InputNumber from '@/components/inputNumber';
import { Spin } from 'view-ui-plus';
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import useSelect from '@/hooks/select';
import { fetchTextImageData, fetchFontIdList } from '@/api/textImage';
const { fabric, canvasEditor, isOne, isGroup } = useSelect();
// 定义选中组的自定义属性
const selectedGroupAttributes = reactive({
  fontId: '', // 字体类型ID
  sentence: '', // 输入的文字
  imgSize: 128, // 图片大小
  layout: 0, // 图片排版，0代表横排版，1代表竖排版
  color: 'rgba(0,0,0,1)', // 字体颜色
  stroke: {
    color: 'rgba(0,0,0,0)', // 边框颜色
    width: 0, // 边框宽度
    type: '', // 边框类型
  },
});
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
// 获取当前选中对象的属性
const getObjectAttr = () => {
  const activeObject = canvasEditor.canvas.getActiveObject();
  extensionType.value = activeObject?.extensionType || '';
  if (activeObject && activeObject?.extensionType === 'textImage') {
    const { sentence, imgSize, layout, fontId, color, stroke } = activeObject.extension;
    // 将解构的属性赋值到 selectedGroupAttributes
    Object.assign(selectedGroupAttributes, {
      sentence: sentence || '',
      imgSize: imgSize || 1,
      layout: layout || 0,
      fontId: fontId || '',
      color: color || 'rgba(0,0,0,1)',
      stroke: {
        color: stroke?.color || 'rgba(0,0,0,0)',
        width: stroke?.width || 0,
        type: stroke?.type || '',
      },
    });
    console.log('selectedGroupAttributes:', selectedGroupAttributes);
  }
};
// 获取字体id数据
const fontIdList = JSON.parse(sessionStorage.getItem('fontIdList')) || [];
const getFontIdList = async () => {
  if (fontIdList.length > 0) {
    // 如果 fontIdList 已经存在，直接使用
    console.log('从会话存储中获取 fontIdList 数据:', fontIdList);
  } else {
    // 如果 fontIdList 不存在，重新获取
    console.log('会话存储中没有 fontIdList 数据，重新获取');
    try {
      const response = await fetchFontIdList();
      // console.log('获取 modelList 数据成功:', response.data);
      if (!response || !response.data || !response.data.data) {
        console.error('获取 fontIdList 数据失败:', response);
        return; // 如果数据无效，直接退出
      }
      fontIdList.push(...response.data.data);
      console.log('获取fontIdList 数据成功:', fontIdList);
      // 将 fontIdList 存储到会话存储中
      sessionStorage.setItem('fontIdList', JSON.stringify(fontIdList));
    } catch (error) {
      console.error('获取fontIdList 数据失败:', error);
    }
  }
};
let isUpdating = false; // 状态锁
const showError = ref(false); // 控制错误提示的显示
// 更新组内容的函数
const updateGroupContent = async () => {
  if (!selectedGroupAttributes.sentence) {
    showError.value = true; // 显示错误提示
    return;
  }
  if (isUpdating) {
    console.warn('操作正在进行中，请稍候...');
    return;
  }
  isUpdating = true; // 设置状态锁
  showError.value = false; // 隐藏错误提示
  Spin.show(); // 显示加载动画
  try {
    // 获取选中的组对象
    const activeObject = canvasEditor.canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'group') {
      console.error('请先选中一个组对象');
      return;
    }

    const group = activeObject;

    const postData = {
      font_id: selectedGroupAttributes.fontId,
      chars: selectedGroupAttributes.sentence,
      img_size: selectedGroupAttributes.imgSize,
      layout: selectedGroupAttributes.layout,
      color: selectedGroupAttributes.color,
      stroke: {
        color: selectedGroupAttributes.stroke.color,
        width: selectedGroupAttributes.stroke.width,
        type: selectedGroupAttributes.stroke.type,
      },
    };
    console.log('请求数据:', postData);

    // 调用接口获取数据
    let response;
    try {
      response = await fetchTextImageData(postData);
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
    console.log('接口返回的数据:', glyphsData);

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
        x_offset: layout?.x_offset, // 如果 layout_data 中没有对应数据，动态计算 x_offset
        y_offset: layout?.y_offset, // 如果 layout_data 中没有对应数据，默认 y_offset 为 0
        z_index: layout?.z_index, // 如果 layout_data 中没有对应数据，按顺序设置 z_index
      };
    });

    // 如果没有字符，直接返回
    if (charsArray.length === 0) {
      console.error('没有字符数据可处理');
      return;
    }

    const imageObjectsMap = {}; // 用于存储加载完成的图片对象，按字符索引存储

    filteredLayoutData.forEach((layout, index) => {
      const charData = char_glyph_dict[layout.char];
      if (!charData) {
        console.warn(`字符 "${layout.char}" 没有对应的图片数据`);
        if (++loadedImages === charsArray.length) {
          createNewGroup();
        }
        return;
      }

      fabric.Image.fromURL(
        charData.img,
        (img) => {
          // console.log(`加载图片: ${layout.char}`, img);

          // 设置图片属性
          img.set({
            id: charData.id,
            left: layout.x_offset,
            top: layout.y_offset,
            scaleX: selectedGroupAttributes.imgSize / img.width, // 根据 imgSize 计算缩放比例
            scaleY: selectedGroupAttributes.imgSize / img.height, // 根据 imgSize 计算缩放比例
            imgSize: selectedGroupAttributes.imgSize,
            extension: {
              fontId: postData.font_id,
              name: charData.char,
              imgSize: selectedGroupAttributes.imgSize,
            },
            extensionType: 'fontImage',
          });

          // 按索引存储图片对象
          imageObjectsMap[index] = img;

          // 检查是否所有图片都已加载完成
          if (++loadedImages === charsArray.length) {
            // 按索引顺序将图片对象添加到 imageObjects
            imageObjects.length = 0; // 清空数组
            for (let i = 0; i < charsArray.length; i++) {
              if (imageObjectsMap[i]) {
                imageObjects.push(imageObjectsMap[i]);
              }
            }
            createNewGroup();
          }
        },
        {
          onError: (e) => {
            console.error(`加载字符 "${layout.char}" 的图片失败`, e);
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
      console.log('imageObjects:', imageObjects);

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
        extension: {
          fontId: postData.font_id, // 更新字体ID
          sentence: postData.chars, // 更新句子
          imgSize: postData.img_size, // 更新图片大小
          layout: postData.layout, // 更新布局
          color: postData.color, // 更新字体颜色
          stroke: postData.stroke, // 更新边框信息
        },
        extensionType: 'textImage', // 更新扩展类型
      });
      console.log(postData.font_id, 'postData.font_id');

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
  getObjectAttr(); // 获取当前选中对象的属性
  getFontIdList(); // 获取字体ID列表
  console.log('获取 fontIdList 数据:', fontIdList);

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

  // console.log('组件已卸载，资源已清理');
});
// 扩展 fabric.Object 的 toObject 方法，解决复制时无法复制自定义属性的问题
// fabric.Object.prototype.toObject = (function (toObject) {
//   return function () {
//     const baseObject = toObject.call(this);
//     if (this.extensionType === 'textImage') {
//       return fabric.util.object.extend(baseObject, {
//         extensionType: this.extensionType,
//         sentence: this.sentence,
//         imgSize: this.imgSize,
//         layout: this.layout,
//         fontId: this.fontId,
//         color: this.color,
//         stroke: this.stroke,
//       });
//     }
//     return baseObject; // 对于其他类型的对象，不添加自定义属性
//   };
// })(fabric.Object.prototype.toObject);
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
    // :deep(.--input),
    // :deep(.ivu-select-selection) {
    //   background-color: transparent;
    //   border: none !important;
    //   box-shadow: none !important;
    // }
    // :deep(.ivu-select-item) {
    //   padding: 1px 4px;
    // }
    // :deep(.ivu-select) {
    //   width: 140px;
    // }
  }
}
.font-selector {
  // max-width: calc(100% - 120px); /* 限制最大宽度，避免挤占 .right 的空间 */
  :deep(.ivu-select-item) {
    padding: 1px 4px;
  }
  :deep(.ivu-select) {
    width: 206px;
  }

  .font-item {
    height: 40px;
    // width: 280px;
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
.input-error {
  border-color: red !important;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>
