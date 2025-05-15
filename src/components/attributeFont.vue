<!--
 * @Author: 秦少卫
 * @Date: 2024-05-21 10:35:12
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-10-07 17:32:41
 * @Description: 字体属性
-->

<template>
  <div class="box attr-item-box" v-if="isOne && isMatchType">
    <!-- <h3>字体属性</h3> -->
    <Divider plain orientation="left"><h4>字体属性</h4></Divider>
    <div>
      <!-- <Divider plain orientation="left">{{ $t('attributes.font') }}</Divider> -->

      <div class="flex-view">
        <div class="flex-item">
          <div class="left font-selector">
            <Select v-model="baseAttr.fontFamily" @on-change="changeFontFamily">
              <Option v-for="item in fontsList" :value="item.name" :key="`font-${item.name}`">
                <div class="font-item" :style="`background-image:url('${item.img}');`">
                  {{ !item.img ? item : '' }}
                  <!-- 解决无法选中问题 -->
                  <span style="display: none">{{ item.name }}</span>
                </div>
              </Option>
            </Select>
          </div>
          <div class="right">
            <InputNumber
              v-model="baseAttr.fontSize"
              @on-change="(value) => changeCommon('fontSize', value)"
              append="字号"
              :min="1"
            ></InputNumber>
          </div>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <!-- 自定义上传字体 -->
          <div class="upload">
            <Upload
              action="//jsonplaceholder.typicode.com/posts/"
              multiple
              :format="['ttf', 'otf', 'eot', 'woff', 'woff2']"
              accept=".ttf,.otf,.eot,.woff,.woff2"
              :before-upload="handleBeforeUpload"
              show-upload-list="false"
            >
              <Button icon="ios-cloud-upload-outline">上传本地字体</Button>
            </Upload>
          </div>
        </div>
      </div>
      <div class="flex-view">
        <div class="flex-item">
          <div class="uploaded-fonts">
            <Dropdown trigger="click">
              <div class="dropText">
                <span>管理本地字体</span>
              </div>

              <template #list>
                <DropdownMenu>
                  <DropdownItem v-if="!uploadedFonts.length">无本地字库，请先上传</DropdownItem>

                  <DropdownItem v-for="font in uploadedFonts" :value="font.name" :key="font.name">
                    <div class="font-manage">
                      <span>{{ font.name }}</span>
                      <Button
                        type="text"
                        size="small"
                        @click.stop="removeFont(font.name)"
                        style="color: red; margin-left: 10px"
                      >
                        删除
                      </Button>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </template>
              <!-- <Option v-for="font in uploadedFonts" :value="font.name" :key="font.name">
                <div class="font-manage">
                  <span>{{ font.name }}</span>
                  <Button
                    type="text"
                    size="small"
                    @click.stop="removeFont(font.name)"
                    style="color: red; margin-left: 10px"
                  >
                    删除
                  </Button>
                </div>
              </Option> -->
            </Dropdown>
          </div>
        </div>
      </div>
      <div class="flex-view">
        <div class="flex-item">
          <RadioGroup
            class="button-group"
            v-model="baseAttr.textAlign"
            @on-change="(value) => changeCommon('textAlign', value)"
            type="button"
          >
            <Radio v-for="(item, i) in textAlignList" :label="item" :key="item">
              <span v-html="textAlignListSvg[i]"></span>
            </Radio>
          </RadioGroup>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <ButtonGroup class="button-group">
            <Button @click="changeFontWeight('fontWeight', baseAttr.fontWeight)">
              <fontWeight
                :fill="baseAttr.fontWeight === 'bold' ? '#305ef4' : '#666'"
                width="14"
                height="14"
              ></fontWeight>
            </Button>
            <Button @click="changeFontStyle('fontStyle', baseAttr.fontStyle)">
              <fontStyle
                :fill="baseAttr.fontStyle === 'italic' ? '#305ef4' : '#666'"
                width="14"
                height="14"
              ></fontStyle>
            </Button>
            <Button @click="changeLineThrough('linethrough', baseAttr.linethrough)">
              <linethrough
                :fill="baseAttr.linethrough ? '#305ef4' : '#666'"
                width="14"
                height="14"
              ></linethrough>
            </Button>
            <Button @click="changeUnderline('underline', baseAttr.underline)">
              <underline
                :fill="baseAttr.underline ? '#305ef4' : '#666'"
                width="14"
                height="14"
              ></underline>
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <Row :gutter="12">
        <Col flex="1">
          <InputNumber
            v-model="baseAttr.lineHeight"
            @on-change="(value) => changeCommon('lineHeight', value)"
            :step="0.1"
            :append="$t('attributes.line_height')"
          ></InputNumber>
        </Col>
        <Col flex="1">
          <InputNumber
            v-model="baseAttr.charSpacing"
            @on-change="(value) => changeCommon('charSpacing', value)"
            :append="$t('attributes.char_spacing')"
          ></InputNumber>
        </Col>
      </Row>

      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t('background') }}</span>
          <div class="content">
            <ColorPicker
              v-model="baseAttr.textBackgroundColor"
              @on-change="(value) => changeCommon('textBackgroundColor', value)"
              alpha
            />
          </div>
        </div>
      </div>
    </div>
    <!-- <Divider plain></Divider> -->
  </div>
</template>
<script setup name="AttrBute">
import { ref } from 'vue';
import useSelect from '@/hooks/select';
import { Spin, Upload, Notice, Dropdown } from 'view-ui-plus';
import InputNumber from '@/components/inputNumber';
import fontWeight from '@/assets/icon/attribute/fontWeight.svg';
import fontStyle from '@/assets/icon/attribute/fontStyle.svg';
import linethrough from '@/assets/icon/attribute/linethrough.svg';
import underline from '@/assets/icon/attribute/underline.svg';

import textAlignLeft from '@/assets/icon/attribute/textAlignLeft.svg?raw';
import textAlignRight from '@/assets/icon/attribute/textAlignRight.svg?raw';
import textAlignCenter from '@/assets/icon/attribute/textAlignCenter.svg?raw';
import textAlignJustitfy from '@/assets/icon/attribute/textAlignJustitfy.svg?raw';

const update = getCurrentInstance();

// 文字元素
const textType = ['i-text', 'textbox', 'text'];
const { canvasEditor, isMatchType, isOne } = useSelect(textType);

// 属性值
const baseAttr = reactive({
  fontSize: 0,
  fontFamily: '',
  lineHeight: 0,
  charSpacing: 0,
  fontWeight: '',
  textBackgroundColor: '#fff',
  textAlign: '',
  fontStyle: '',
  underline: false,
  linethrough: false,
  overline: false,
});
const fontsList = ref([]);
// 初始化加载字体
// 先加载系统字体
canvasEditor.getFontList().then((list) => {
  systemFonts.value = list;
  // 再加载已上传字体
  loadUploadedFonts();
});
// 存储系统字体列表
const systemFonts = ref([]);
// 记录正在处理的文件名，防止重复上传
const processingFiles = ref(new Set());

const base64Encode = (str) => {
  return btoa(unescape(encodeURIComponent(str)));
};
// 存储上传的字体文件
const uploadedFonts = ref([]);

// IndexedDB 操作
let db;
const DB_NAME = 'canvasFontsDB';
const STORE_NAME = 'uploadedFonts';

// 初始化 IndexedDB
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'name' });
      store.createIndex('name', 'name', { unique: true });
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve();
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(event.target.error);
    };
  });
};

// 保存字体到 IndexedDB
const saveFontToDB = (fontData, file) => {
  return new Promise((resolve, reject) => {
    if (!db) return reject(new Error('DB not initialized'));

    // 读取文件内容为 ArrayBuffer
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;

      // 在文件读取完成后创建事务
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      // 保存字体数据和文件内容
      const fullFontData = { ...fontData, fileContent: arrayBuffer };
      const request = store.put(fullFontData);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);

      // 监听事务完成或错误
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

// 从 IndexedDB 加载字体
const loadFontsFromDB = () => {
  return new Promise((resolve, reject) => {
    if (!db) return reject(new Error('DB not initialized'));

    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = (event) => {
      const fonts = event.target.result || [];
      resolve(fonts);
    };

    request.onerror = () => reject(request.error);
  });
};

// 检查字体是否已存在（包括系统字体和已上传字体）
const isFontExists = (fontName) => {
  // 检查系统字体
  if (systemFonts.value.some((font) => font.name === fontName)) {
    return true;
  }
  // 检查已上传字体
  if (uploadedFonts.value.some((font) => font.name === fontName)) {
    return true;
  }
  // 检查正在处理的文件
  if (processingFiles.value.has(fontName)) {
    return true;
  }
  return false;
};

// 从 IndexedDB 加载上传的字体
const loadUploadedFonts = async () => {
  try {
    await initDB();
    const fonts = await loadFontsFromDB();

    // 清空旧数据
    uploadedFonts.value = [];

    // 处理每个字体，重新创建 URL 和样式
    for (const font of fonts) {
      // 从 ArrayBuffer 创建 Blob
      const blob = new Blob([font.fileContent], { type: 'application/octet-stream' });
      const fontUrl = URL.createObjectURL(blob);

      // 重新应用字体样式
      const fontFace = `
        @font-face {
          font-family: '${font.name}';
          src: url('${fontUrl}') format('truetype'),
               url('${fontUrl.replace('.ttf', '.woff')}') format('woff');
        }
      `;

      const style = document.createElement('style');
      style.type = 'text/css';
      style.appendChild(document.createTextNode(fontFace));
      document.head.appendChild(style);

      // 更新字体数据中的 URL
      font.file = fontUrl;

      // 添加到已上传字体列表（确保不重复）
      if (!uploadedFonts.value.some((f) => f.name === font.name)) {
        uploadedFonts.value.push(font);
      }
    }

    syncFontsList();
  } catch (error) {
    console.error('Failed to load fonts from IndexedDB:', error);
    Notice.warning({
      title: '加载失败',
      desc: '无法加载已上传的字体',
      duration: 2,
    });
  }
};

// 更新 fontsList
const syncFontsList = () => {
  // 合并系统字体和已上传字体，保持 fontsList 结构不变
  fontsList.value = [...uploadedFonts.value, ...systemFonts.value];
};

// 处理上传的字体文件
const handleBeforeUpload = async (file) => {
  // 处理格式错误
  const { name } = file;
  const format = name.split('.').pop().toLowerCase(); // 将后缀转换为小写
  if (!['ttf', 'otf', 'eot', 'woff', 'woff2'].includes(format)) {
    Notice.warning({
      title: '上传失败',
      desc: '请上传 ttf、otf、eot、woff、woff2 格式的字体文件',
      duration: 2,
    });
    return false;
  } else {
    const fontName = name.split('.')[0];

    // 检查字体是否已存在或正在处理
    if (isFontExists(fontName)) {
      Notice.warning({
        title: '重复上传',
        desc: `字体 "${fontName}" 已存在或正在上传`,
        duration: 2,
      });
      return false;
    }

    // 标记为正在处理
    processingFiles.value.add(fontName);

    try {
      // 动态加载字体
      const fontUrl = URL.createObjectURL(file);
      const fontFace = `
        @font-face {
          font-family: '${fontName}';
          src: url('${fontUrl}') format('truetype'),
               url('${fontUrl.replace('.ttf', '.woff')}') format('woff');
        }
      `;

      const style = document.createElement('style');
      style.type = 'text/css';
      style.appendChild(document.createTextNode(fontFace));
      document.head.appendChild(style);

      // 动态生成 SVG 图标
      const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="990" height="120" viewBox="0 0 990 120">
          <style>
            @font-face {
              font-family: '${fontName}';
              src: url('${fontUrl}') format('truetype'),
                   url('${fontUrl.replace('.ttf', '.woff')}') format('woff');
            }
            text {
              font-family: '${fontName}';
            }
          </style>
          <rect width="990" height="120" fill="transparent" />
          <text x="10" y="50%" font-family='${fontName}' dominant-baseline="middle"  fill="#333" font-size="70">
            ${fontName}
          </text>
        </svg>
      `;

      // 构造字体数据对象
      const fontData = {
        name: fontName,
        type: 'cn',
        file: fontUrl,
        img: `data:image/svg+xml;base64,${base64Encode(svgIcon)}`,
      };

      // 保存到 IndexedDB
      await saveFontToDB(fontData, file);

      // 添加到已上传字体列表
      uploadedFonts.value.unshift(fontData);

      // 更新字体列表
      syncFontsList();

      Notice.success({
        title: '上传成功',
        desc: `字体 "${fontName}" 上传成功`,
        duration: 3,
      });

      return false; // 阻止默认上传行为
    } catch (error) {
      console.error('Failed to upload font:', error);
      Notice.error({
        title: '上传失败',
        desc: `保存字体 "${fontName}" 时出错`,
        duration: 2,
      });
      return false;
    } finally {
      // 移除处理标记
      processingFiles.value.delete(fontName);
    }
  }
};

// 删除指定的本地字体
const removeFont = (name) => {
  return new Promise((resolve, reject) => {
    if (!db) return reject(new Error('DB not initialized'));

    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(name);

    request.onsuccess = () => {
      // 从uploadedFonts中删除对应的字体
      uploadedFonts.value = uploadedFonts.value.filter((font) => font.name !== name);
      // 更新字体列表
      syncFontsList();
      resolve();
    };

    request.onerror = () => reject(request.error);
  });
};

// 字体对齐方式
const textAlignList = ['left', 'center', 'right', 'justify'];
// 对齐图标
const textAlignListSvg = [textAlignLeft, textAlignCenter, textAlignRight, textAlignJustitfy];

// 属性获取
const getObjectAttr = (e) => {
  const activeObject = canvasEditor.canvas.getActiveObject();
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return;
  if (activeObject && isMatchType) {
    baseAttr.fontSize = activeObject.get('fontSize');
    baseAttr.fontFamily = activeObject.get('fontFamily');
    baseAttr.lineHeight = activeObject.get('lineHeight');
    baseAttr.textAlign = activeObject.get('textAlign');
    baseAttr.underline = activeObject.get('underline');
    baseAttr.linethrough = activeObject.get('linethrough');
    baseAttr.charSpacing = activeObject.get('charSpacing');
    baseAttr.overline = activeObject.get('overline');
    baseAttr.fontStyle = activeObject.get('fontStyle');
    baseAttr.textBackgroundColor = activeObject.get('textBackgroundColor');
    baseAttr.fontWeight = activeObject.get('fontWeight');
  }
};

// 通用属性改变
const changeCommon = (key, value) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  if (activeObject) {
    activeObject && activeObject.set(key, value);
    canvasEditor.canvas.renderAll();
  }
};

const selectCancel = () => {
  update?.proxy?.$forceUpdate();
};

const changeFontFamily = async (fontName) => {
  if (!fontName) return;
  Spin.show();
  canvasEditor.loadFont(fontName).finally(() => Spin.hide());
};
const changeFontWeight = (key, value) => {
  const nValue = value === 'normal' ? 'bold' : 'normal';
  baseAttr.fontWeight = nValue;
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject && activeObject.set(key, nValue);
  canvasEditor.canvas.renderAll();
};

// 斜体
const changeFontStyle = (key, value) => {
  const nValue = value === 'normal' ? 'italic' : 'normal';
  baseAttr.fontStyle = nValue;
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject && activeObject.set(key, nValue);
  canvasEditor.canvas.renderAll();
};

// 中划
const changeLineThrough = (key, value) => {
  const nValue = value === false;
  baseAttr.linethrough = nValue;
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject && activeObject.set(key, nValue);
  canvasEditor.canvas.renderAll();
};

// 下划
const changeUnderline = (key, value) => {
  const nValue = value === false;
  baseAttr.underline = nValue;
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject && activeObject.set(key, nValue);
  canvasEditor.canvas.renderAll();
};

onMounted(() => {
  // 获取字体数据
  getObjectAttr();
  canvasEditor.on('selectCancel', selectCancel);
  canvasEditor.on('selectOne', getObjectAttr);
  canvasEditor.canvas.on('object:modified', getObjectAttr);
});

onBeforeUnmount(() => {
  canvasEditor.off('selectCancel', selectCancel);
  canvasEditor.off('selectOne', getObjectAttr);
  canvasEditor.canvas.off('object:modified', getObjectAttr);

  // 关闭数据库连接
  if (db && db instanceof IDBDatabase && !db.close) {
    db.close();
  }
});
</script>

<style scoped lang="less">
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
    background-size: auto 28px;
    background-repeat: no-repeat;
  }
}

.flex-view {
  width: 100%;
  margin-bottom: 5px;
  padding: 5px;
  display: inline-flex;
  justify-content: space-between;
  border-radius: 5px;
  background: #f6f7f9;
}
.flex-item {
  display: inline-flex;
  flex: 1;
  .label {
    width: 32px;
    height: 32px;
    line-height: 32px;
    display: inline-block;
    font-size: 14px;
    // color: #333333;
  }
  .content {
    flex: 1;
    // width: 60px;
  }
  .slider-box {
    width: calc(100% - 50px);
    margin-left: 10px;
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
  .upload {
    flex: 1;
    :deep(.ivu-upload) {
      width: 100%;
    }
    :deep(.ivu-btn-default, .ivu-btn) {
      width: 100%;
    }
    :deep(.ivu-upload-list) {
      display: none;
      height: 0;
    }
  }
  .uploaded-fonts {
    // justify-content: center;
    width: 100%;
    overflow: hidden;
    user-select: none;
    :deep(.ivu-dropdown) {
      width: 268px;
    }
    :deep(.ivu-select-dropdown) {
      max-height: 200px;
      overflow-y: auto;
    }
    .dropText {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px 12px;
      border: 1px solid #d9d9d9; /* 边框颜色 */
      border-radius: 4px; /* 圆角 */
      background-color: #fff; /* 背景颜色 */
      color: #606266; /* 文字颜色 */
      font-size: 14px; /* 字体大小 */
      cursor: pointer; /* 鼠标样式 */
      transition: all 0.3s; /* 动画过渡效果 */

      &:hover {
        border-color: #40a9ff; /* 鼠标悬停时的边框颜色 */
      }
    }
    .font-manage {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 260px;
      :deep(.ivu-dropdown) {
        width: 260px;
      }
      :deep(.ivu-select-dropdown) {
        width: 260px;
      }

      span {
        flex: 3;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      button {
        flex: 1;
      }
    }
  }
  :deep(.ivu-slider-wrap) {
    margin: 13px 0;
  }
  :deep(.ivu-radio-group-button) {
    display: flex;
    flex: 1;
    width: 100%;
    & .ivu-radio-wrapper {
      // width: 48px;
      flex: 1;
      line-height: 40px;
      text-align: center;
      svg {
        vertical-align: baseline;
      }
    }
  }

  :deep(.ivu-btn-group) {
    display: flex;
    flex: 1;
    .ivu-btn {
      flex: 1;
    }
  }

  :deep(.ivu-btn-group-large) {
    & > .ivu-btn {
      font-size: 24px;
      flex: 1;
    }
  }

  :deep(.ivu-radio-group-button) {
    &.ivu-radio-group-large .ivu-radio-wrapper {
      font-size: 24px;
    }
  }
}
</style>
