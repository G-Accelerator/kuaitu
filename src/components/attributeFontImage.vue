<template>
  <div v-if="isOne && type === 'image' && isFontImage" class="box attr-item-box">
    <Divider plain orientation="left">
      <h4>单个图片文字属性</h4>
    </Divider>
    <div class="fontImgList">
      <Spin show="1" fix size="large" v-if="isLoading"></Spin>

      <div class="grid">
        <div
          class="grid-item"
          v-for="(item, index) in displayedFontImgList"
          :key="item.id || index"
          :class="{ selected: selectedIndex === index }"
        >
          <img
            v-if="item.img"
            :src="item.img"
            class="img"
            loading="lazy"
            @click="replaceFontImage(index, item)"
          />
          <span v-else class="noData" disable>无数据</span>
        </div>
      </div>
    </div>

    <div class="page">
      <Button type="small" @click="getFontImgList" :disabled="isLoading">
        {{ isLoading ? '加载中...' : '生成一批' }}
      </Button>
      <Page
        v-model="currentPage"
        :total="originalLength"
        :pageSize="9"
        simple
        @on-change="handlePageChange"
      />
      <span>共{{ originalLength }}条</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import useSelect from '@/hooks/select';
import { Spin } from 'view-ui-plus';
import { Utils } from '@kuaitu/core';
import { debounce } from 'lodash-es';
import { fetchFontList, postFontChoice, fetchTextImageData } from '@/api/textImage';
const { insertImgFile } = Utils;
const { fabric, isOne, canvasEditor } = useSelect();
const selectedFontData = reactive({
  id: '',
  fontId: '',
  name: '',
  src: '',
  imgSize: '',
  // type: '',
  // width: 128,
  // height: 128,
  // scaleX: 1,
  // scaleY: 1,
});
const extensionType = ref('');
const isFontImage = computed(() => extensionType.value === 'fontImage'); // 是否为字体图片类型
const selectedIndex = ref(-1);
const type = ref('');

// 所有字体图片数据
const allFontImgList = ref(JSON.parse(sessionStorage.getItem('allFontImgList')) || []); // [{ fontId: '', char: '', glyphs: [] }]
const originalLength = ref(0); // 用于保存原始长度
// 当前显示的字体图片数据（基于分页）
const displayedFontImgList = computed(() => {
  const currentFontData = allFontImgList.value.find(
    (item) => item.fontId === selectedFontData.fontId && item.char === selectedFontData.name
  );
  const glyphs = currentFontData ? currentFontData.glyphs : [];
  const startIndex = (currentPage.value - 1) * 9;
  const currentData = glyphs.slice(startIndex, startIndex + 9);
  // 填充空数据以确保总数为 9
  while (currentData.length < 9) {
    currentData.push({ id: '', char: '', img: null });
  }
  return currentData;
});
const isLoading = ref(false); // 控制加载动画的显示
// 获取备选字体
const getFontImgList = debounce(async (isRefresh = false) => {
  try {
    isLoading.value = true; // 显示加载动画

    // 检查缓存中是否已有数据
    const cachedData = allFontImgList.value.find(
      (item) => item.fontId === selectedFontData.fontId && item.char === selectedFontData.name
    );

    if (cachedData && !isRefresh) {
      console.log('使用缓存的字体图片数据:', cachedData.glyphs);
      isLoading.value = false; // 隐藏加载动画
      return;
    }
    const params = {
      font_id: selectedFontData.fontId || '',
      char: selectedFontData.name || '',
      img_size: selectedFontData.imgSize || 128,
    };
    // 如果没有缓存数据或需要刷新，发起请求获取字体类型数据
    const response = await fetchFontList(params);

    if (response.data && response.data.data) {
      const glyphs = response.data.data.glyphs || [];
      console.log('获取字体图片数据成功:', glyphs);

      // 更新 allFontImgList
      const existingIndex = allFontImgList.value.findIndex(
        (item) => item.fontId === selectedFontData.fontId && item.char === selectedFontData.name
      );

      if (existingIndex !== -1) {
        // 更新已有数据
        allFontImgList.value[existingIndex].glyphs = glyphs;
      } else {
        // 添加新数据
        allFontImgList.value.push({
          fontId: selectedFontData.fontId,
          char: selectedFontData.name,
          glyphs,
        });
      }

      // 更新会话存储
      sessionStorage.setItem('allFontImgList', JSON.stringify(allFontImgList.value));
      originalLength.value = glyphs.length; // 保存原始长度
      console.log('长度:', originalLength.value);
      selectedIndex.value = -1; // 重置选中状态
      currentPage.value = 1; // 重置为第一页
    } else {
      console.error('接口返回的数据无效:', response);
    }
  } catch (error) {
    console.error('获取字体图片列表失败:', error);
  } finally {
    isLoading.value = false; // 隐藏加载动画
  }
}, 300);
// // 初始化数据
// const initialFontImgList = [
//   {
//     id: '难test',
//     char: '',
//     img: 'data:image/png;base64,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',
//   },
//   { id: '', char: '', img: '#' },
//   { id: '', char: '', img: '#' },
//   { id: '', char: '', img: '#' },
//   { id: '', char: '', img: '#' },
//   { id: '', char: '', img: '#' },
//   { id: '', char: '', img: '#' },
//   {
//     id: '',
//     char: '',
//     img: 'https://img-s.msn.cn/tenant/amp/entityid/AA13bUap?w=20&h=0&q=90&m=6&f=png&u=t',
//   },
// ];

// // 初始化数据
// allFontImgList.value = initialFontImgList;
let currentPage = ref(1);
const handlePageChange = (page) => {
  // 立即重置选中状态，保持视觉一致性
  selectedIndex.value = -1;
  // 使用防抖处理数据加载逻辑
  loadDataDebounced(page);
};
// 单独的防抖函数，只用于数据加载
const loadDataDebounced = debounce((page) => {
  currentPage.value = page;
  // 加载更多数据的逻辑
}, 300);
// 获取选中的文字图片信息
const handleSelectOne = () => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  if (!activeObject) {
    console.warn('未选中任何对象');
    return;
  }
  selectedIndex.value = -1;
  // console.log('activeObject', activeObject);

  if (activeObject) {
    // selectedFontData.width = activeObject.width || 128;
    // selectedFontData.height = activeObject.height || 128;
    // selectedFontData.type = activeObject.type || '';
    selectedFontData.id = activeObject.id || '';
    selectedFontData.fontId = activeObject.extension.fontId || '';
    selectedFontData.name = activeObject.extension.name || '';
    selectedFontData.imgSize = activeObject.imgSize || '';
    selectedFontData.src = activeObject._element?.currentSrc || '';
    extensionType.value = activeObject.extensionType || '';
    type.value = activeObject.type || '';
    // 如果会话存储中有对应数据，直接渲染
    const cachedData = allFontImgList.value.find(
      (item) => item.fontId === selectedFontData.fontId && item.char === selectedFontData.name
    );
    // 更新 originalLength 为当前选中文字的 glyphs 总数
    originalLength.value = cachedData ? cachedData.glyphs.length : 0;
    currentPage.value = 1; // 重置当前页码
  }
  // console.log('selectedFontData', selectedFontData);
};
// 替换字体图片(会把整个页面的字体图片都替换成新的)
const replaceFontImage = async (index, newFontImg) => {
  selectedIndex.value = index;
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  if (!activeObject || type.value !== 'image') {
    console.warn('未选中图片对象，无法替换');
    return;
  }
  Spin.show();
  console.log('开始替换图片:', newFontImg.img);
  try {
    console.log('尝试向接口发送验证请求...');
    console.log('glyph_id', newFontImg.id);
    console.log('font_id', selectedFontData.fontId);
    console.log('char', selectedFontData.name);
    // 向接口发送 POST 请求
    const data = {
      font_id: selectedFontData.fontId,
      char: selectedFontData.name,
      glyph_id: newFontImg.id,
    };
    const response = await postFontChoice(data);

    // 检查接口返回的 code 是否为 0
    if (response.data.code !== 0) {
      console.error('接口验证失败，code:', response.data.code);
      Spin.hide();
      return;
    }
    const getAllTextImageObjects = () => {
      const allObjects = canvasEditor.canvas.getObjects(); // 获取画布中的所有对象
      const textImageObjects = allObjects.filter((obj) => obj.extensionType === 'textImage'); // 筛选出 extensionType 为 textImage 的对象
      return textImageObjects;
    };

    //获取所有 textImage 对象
    const textImageObjects = getAllTextImageObjects();
    console.log('画布中所有 textImage 对象:', textImageObjects);
    // 遍历 textImageObjects，依次重新发请求获取组内数据
    for (const textImageObject of textImageObjects) {
      if (!textImageObject.extension.sentence.includes(selectedFontData.name)) {
        console.log(`跳过组，sentence 不包含选中的字: ${selectedFontData.name}`);
        continue; // 如果不包含，跳过该组
      }
      // 构建请求数据，全部按照之前的
      const postData = {
        font_id: textImageObject.extension.fontId,
        chars: textImageObject.extension.sentence,
        img_size: textImageObject.extension.imgSize,
        layout: textImageObject.extension.layout,
        color: textImageObject.extension.color,
        stroke: textImageObject.extension.stroke,
      };
      console.log('替换文字请求数据:', postData);
      // 调用接口获取数据
      let response;
      try {
        response = await fetchTextImageData(postData);
      } catch (error) {
        console.error('接口请求失败:', error);
        return; // 如果接口请求失败，直接退出
      }
      console.log('接口请求结果:', response);

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
      const { left, top, scaleX, scaleY } = textImageObject;

      // 清空组内的内容
      const objectsToRemove = textImageObject._objects;
      objectsToRemove.forEach((obj) => canvasEditor.canvas.remove(obj));
      textImageObject._objects.length = 0; // 清空组的子对象数组
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
            console.log(`加载图片: ${layout.char}`, img);

            // 设置图片属性
            img.set({
              id: charData.id,
              left: layout.x_offset,
              top: layout.y_offset,
              scaleX: textImageObject.extension.imgSize / img.width, // 根据 imgSize 计算缩放比例
              scaleY: textImageObject.extension.imgSize / img.height, // 根据 imgSize 计算缩放比例
              imgSize: textImageObject.extension.imgSize,
              extension: {
                fontId: postData.font_id,
                name: charData.char,
                imgSize: textImageObject.extension.imgSize,
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
              console.log('最终的 imageObjects:', imageObjects);
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
        canvasEditor.canvas.remove(textImageObject); // 移除旧组
        canvasEditor.canvas.add(newGroup);
        canvasEditor.canvas.renderAll();
        // Spin.show(); // 显示加载动画
        // console.log('组内容已成功更新');
      };
    }
    Spin.hide();
    // 单字替换部分的代码
    // const imgEl = await insertImgFile(newFontImg.img);
    // const timeout = setTimeout(() => {
    //   console.warn('图片加载超时');
    //   Spin.hide();
    // }, 10000);
    // activeObject.setSrc(
    //   imgEl.src,
    //   () => {
    //     clearTimeout(timeout);
    //     activeObject.set({
    //       id: newFontImg.id,
    //     });
    //     activeObject.set(
    //       'scaleX',
    //       (selectedFontData.width * selectedFontData.scaleX) / imgEl.width
    //     );
    //     activeObject.set(
    //       'scaleY',
    //       (selectedFontData.height * selectedFontData.scaleY) / imgEl.height
    //     );
    //     // canvasEditor.canvas.renderAll(); // 强制重新渲染画布
    //     let originalZoom = canvasEditor.canvas.getZoom(); // 保存当前缩放比例
    //     const canvasCenter = canvasEditor.canvas.getCenter(); // 获取画布中心点
    //     // 放大一点点
    //     canvasEditor.canvas.zoomToPoint(
    //       { x: canvasCenter.left, y: canvasCenter.top }, // 以画布中心点为基准
    //       originalZoom + 0.0000001 //放大一点点
    //     );
    //     // // 恢复原来的缩放比例
    //     // canvasEditor.canvas.zoomToPoint(
    //     //   { x: canvasCenter.left, y: canvasCenter.top },
    //     //   originalZoom
    //     // );
    //     imgEl.remove();
    //     Spin.hide();
    //   },
    //   {
    //     crossOrigin: 'anonymous',
    //     onError: () => {
    //       clearTimeout(timeout);
    //       console.error('图片加载失败:', newFontImg.img);
    //       imgEl.remove();
    //       Spin.hide();
    //     },
    //   }
    // );
    // imgEl.remove();
  } catch (error) {
    console.error('图片插入失败:', error);
    Spin.hide();
  }
};
onMounted(() => {
  canvasEditor.on('selectOne', handleSelectOne);
  selectedIndex.value = -1;
});
onBeforeUnmount(() => {
  canvasEditor.off('selectOne', handleSelectOne);
});
</script>
<style lang="less" scoped>
.fontImgList {
  position: relative;
  top: 0;
  left: 0;
  width: 90%;
  margin: 0 auto;

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 九宫格布局 */
    gap: 10px;
  }

  .grid-item {
    position: relative;
    width: 100%;
    padding-top: 100%; /* 保持正方形 */
    overflow: hidden;
    background: #f0f0f0;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    &.selected {
      box-shadow: 0 0 0 1px #2d8cf0; /* 选中时的边框样式 */
    }
    .img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
      cursor: pointer;
    }
    .noData {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      color: #707070;
      background-color: #70707025;
      font-size: 14px;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: not-allowed;
    }
  }
}
.page {
  margin: 0 auto;
  margin-top: 20px;
  width: 95%;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  justify-content: center;
  align-items: center;
}
</style>
