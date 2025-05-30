<template>
  <div>
    <Divider plain orientation="left">{{ $t('common_elements') }}</Divider>
    <div class="tool-box">
      <span @click="() => addText()" :draggable="true" @dragend="addText">
        <textIcon width="26" height="26"></textIcon>
      </span>
      <span @click="() => addTextBox()" :draggable="true" @dragend="addTextBox">
        <textBoxIcon width="26" height="26"></textBoxIcon>
      </span>
      <span @click="() => addRect()" :draggable="true" @dragend="addRect">
        <rectIcon width="26" height="26"></rectIcon>
      </span>
      <span @click="() => addCircle()" :draggable="true" @dragend="addCircle">
        <circleIcon width="26" height="26"></circleIcon>
      </span>
      <span @click="() => addTriangle()" :draggable="true" @dragend="addTriangle">
        <triangleIcon width="26" height="26"></triangleIcon>
      </span>
      <!-- 多边形按钮 -->
      <span @click="() => addPolygon()" :draggable="true" @dragend="addPolygon">
        <polygonIcon width="26" height="26"></polygonIcon>
      </span>
    </div>
    <Divider plain orientation="left">{{ $t('draw_elements') }}</Divider>
    <div class="tool-box">
      <span
        @click="drawingLineModeSwitch('line')"
        :class="state.isDrawingLineMode && state.lineType === 'line' && 'bg'"
      >
        <draw1Icon width="20" height="20"></draw1Icon>
      </span>
      <span
        @click="drawingLineModeSwitch('arrow')"
        :class="state.isDrawingLineMode && state.lineType === 'arrow' && 'bg'"
      >
        <!-- <svg t="1673022047861" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4206" width="20" height="20"><path d="M187.733333 1024h-170.666666c-10.24 0-17.066667-6.826667-17.066667-17.066667v-170.666666c0-10.24 6.826667-17.066667 17.066667-17.066667h170.666666c10.24 0 17.066667 6.826667 17.066667 17.066667v170.666666c0 10.24-6.826667 17.066667-17.066667 17.066667zM34.133333 989.866667h136.533334v-136.533334H34.133333v136.533334zM1006.933333 204.8h-170.666666c-10.24 0-17.066667-6.826667-17.066667-17.066667v-170.666666c0-10.24 6.826667-17.066667 17.066667-17.066667h170.666666c10.24 0 17.066667 6.826667 17.066667 17.066667v170.666666c0 10.24-6.826667 17.066667-17.066667 17.066667zM853.333333 170.666667h136.533334V34.133333h-136.533334v136.533334z" fill="" p-id="4207"></path><path d="M187.733333 853.333333c-3.413333 0-10.24 0-13.653333-3.413333-6.826667-6.826667-6.826667-17.066667 0-23.893333l648.533333-648.533334c6.826667-6.826667 17.066667-6.826667 23.893334 0s6.826667 17.066667 0 23.893334l-648.533334 648.533333c0 3.413333-6.826667 3.413333-10.24 3.413333z" fill="" p-id="4208"></path></svg> -->
        <draw2Icon width="20" height="20"></draw2Icon>
      </span>
      <span
        @click="drawingLineModeSwitch('thinTailArrow')"
        :class="state.isDrawingLineMode && state.lineType === 'thinTailArrow' && 'bg'"
      >
        <draw3Icon width="20" height="20"></draw3Icon>
      </span>
      <span
        @click="drawPolygon"
        :class="state.isDrawingLineMode && state.lineType === 'polygon' && 'bg'"
      >
        <draw4Icon width="20" height="20"></draw4Icon>
      </span>
      <!-- 隐藏功能入口（路径文本） -->
      <!-- <span
        @click="drawPathText"
        :class="state.isDrawingLineMode && state.lineType === 'pathText' && 'bg'"
      >
        <Icon type="logo-tumblr" :size="22" />
      </span> -->
      <span
        @click="freeDraw"
        :class="state.isDrawingLineMode && state.lineType === 'freeDraw' && 'bg'"
      >
        <Icon type="md-brush" :size="22" />
      </span>
    </div>
    <Divider plain orientation="left">{{ $t('code_img') }}</Divider>
    <div class="tool-box">
      <span @click="canvasEditor.addQrCode">
        <qrCodeIcon></qrCodeIcon>
      </span>
      <span @click="canvasEditor.addBarcode">
        <barCodeIcon></barCodeIcon>
      </span>
    </div>
    <Divider plain orientation="left">{{ $t('img_fonts') }}</Divider>
    <div class="tool-box"><span @click="addTextImages">图片文字</span></div>
    <!-- <div class="tool-box">
      <span>
        <Input
          v-model="text"
          placeholder="请输入文字..."
          style="width: 98%; margin: 0 auto"
          @keyup.enter="addTextImages"
        >
          <template #append>
            <Button @click="addTextImages">新建</Button>
          </template>
        </Input>
      </span>
    </div> -->
    <!-- <div class="box">
      <div class="list">
        <p>图片排版</p>
        <RadioGroup v-model="layout" type="button">
          <Radio label="横排版"></Radio>
          <Radio label="竖排版"></Radio>
        </RadioGroup>
      </div>
      <div class="list">
        <p>图片大小</p>
        <InputNumber v-model="imgSize" style="margin: 0 auto; width: 148px" />
      </div>
      <div class="list">
        <p>类型</p>

        <Select v-model="model" style="margin: 0 auto; width: 148px">
          <Option v-for="item in cityList" :value="item.value" :key="item.value" v-model="imgSize">
            {{ item.label }}
          </Option>
        </Select>
      </div>
    </div> -->
  </div>
</template>

<script setup name="Tools">
import { getPolygonVertices } from '@/utils/math';
import useSelect from '@/hooks/select';
import circleIcon from '@/assets/icon/tools/circle.svg';
import draw1Icon from '@/assets/icon/tools/draw1.svg';
import draw2Icon from '@/assets/icon/tools/draw2.svg';
import draw3Icon from '@/assets/icon/tools/draw3.svg';
import draw4Icon from '@/assets/icon/tools/draw4.svg';

import polygonIcon from '@/assets/icon/tools/polygon.svg';
import rectIcon from '@/assets/icon/tools/rect.svg';
import textIcon from '@/assets/icon/tools/text.svg';
import textBoxIcon from '@/assets/icon/tools/textBox.svg';
import triangleIcon from '@/assets/icon/tools/triangle.svg';

import qrCodeIcon from '@/assets/icon/tools/qrCode.svg';
import barCodeIcon from '@/assets/icon/tools/barCode.svg';

// import useCalculate from '@/hooks/useCalculate';
// const { getCanvasBound, isOutsideCanvas } = useCalculate();

import { useI18n } from 'vue-i18n';
import { Divider } from 'view-ui-plus';
import axios from 'axios';
import { Spin } from 'view-ui-plus';
const baseUrl = import.meta.env.APP_MYAPIHOST;
const LINE_TYPE = {
  polygon: 'polygon',
  freeDraw: 'freeDraw',
  pathText: 'pathText',
};
// 默认属性
const defaultPosition = { shadow: '', fontFamily: 'arial' };

const { t } = useI18n();
const { fabric, canvasEditor } = useSelect();
const state = reactive({
  isDrawingLineMode: false,
  lineType: false,
});

const addText = (event) => {
  cancelDraw();
  const text = new fabric.IText(t('everything_is_fine'), {
    ...defaultPosition,
    fontSize: 80,
    fill: '#000000FF',
  });

  canvasEditor.addBaseType(text, { center: true, event });
};

const addTextBox = (event) => {
  cancelDraw();
  const text = new fabric.Textbox(t('everything_goes_well'), {
    ...defaultPosition,
    splitByGrapheme: true,
    width: 400,
    fontSize: 80,
    fill: '#000000FF',
  });

  canvasEditor.addBaseType(text, { center: true, event });
};

const addTriangle = (event) => {
  cancelDraw();
  const triangle = new fabric.Triangle({
    ...defaultPosition,
    width: 400,
    height: 400,
    fill: '#92706BFF',
    name: '三角形',
  });
  canvasEditor.addBaseType(triangle, { center: true, event });
};

const addPolygon = (event) => {
  cancelDraw();
  const polygon = new fabric.Polygon(getPolygonVertices(5, 200), {
    ...defaultPosition,
    fill: '#CCCCCCFF',
    name: '多边形',
  });
  polygon.set({
    // 创建完设置宽高，不然宽高会变成自动的值
    width: 400,
    height: 400,
    // 关闭偏移
    pathOffset: {
      x: 0,
      y: 0,
    },
  });
  canvasEditor.addBaseType(polygon, { center: true, event });
};

const addCircle = (event) => {
  cancelDraw();
  const circle = new fabric.Circle({
    ...defaultPosition,
    radius: 150,
    fill: '#57606BFF',
    // id: uuid(),
    name: '圆形',
  });
  canvasEditor.addBaseType(circle, { center: true, event });
};

const addRect = (event) => {
  cancelDraw();
  const rect = new fabric.Rect({
    ...defaultPosition,
    fill: '#F57274FF',
    width: 400,
    height: 400,
    name: '矩形',
  });

  canvasEditor.addBaseType(rect, { center: true, event });
};
const drawPolygon = () => {
  const onEnd = () => {
    state.lineType = false;
    state.isDrawingLineMode = false;
    ensureObjectSelEvStatus(!state.isDrawingLineMode, !state.isDrawingLineMode);
  };
  if (state.lineType !== LINE_TYPE.polygon) {
    endConflictTools();
    endDrawingLineMode();
    state.lineType = LINE_TYPE.polygon;
    state.isDrawingLineMode = true;
    canvasEditor.beginDrawPolygon(onEnd);
    canvasEditor.endDraw();
    ensureObjectSelEvStatus(!state.isDrawingLineMode, !state.isDrawingLineMode);
  } else {
    canvasEditor.discardPolygon();
  }
};

const drawPathText = () => {
  if (state.lineType === LINE_TYPE.pathText) {
    state.lineType = false;
    state.isDrawingLineMode = false;
    canvasEditor.endTextPathDraw();
  } else {
    endConflictTools();
    endDrawingLineMode();
    state.lineType = LINE_TYPE.pathText;
    state.isDrawingLineMode = true;
    canvasEditor.startTextPathDraw();
  }
};

const freeDraw = () => {
  if (state.lineType === LINE_TYPE.freeDraw) {
    canvasEditor.endDraw();
    state.lineType = false;
    state.isDrawingLineMode = false;
  } else {
    endConflictTools();
    endDrawingLineMode();
    state.lineType = LINE_TYPE.freeDraw;
    state.isDrawingLineMode = true;
    canvasEditor.startDraw({ width: 20 });
  }
};

const endConflictTools = () => {
  canvasEditor.discardPolygon();
  canvasEditor.endDraw();
  canvasEditor.endTextPathDraw();
};
const endDrawingLineMode = () => {
  state.isDrawingLineMode = false;
  state.lineType = '';
  canvasEditor.setMode(state.isDrawingLineMode);
  canvasEditor.setLineType(state.lineType);
};
const drawingLineModeSwitch = (type) => {
  if ([LINE_TYPE.polygon, LINE_TYPE.freeDraw, LINE_TYPE.pathText].includes(state.lineType)) {
    endConflictTools();
  }
  if (state.lineType === type) {
    state.isDrawingLineMode = false;
    state.lineType = '';
  } else {
    state.isDrawingLineMode = true;
    state.lineType = type;
  }
  canvasEditor.setMode(state.isDrawingLineMode);
  canvasEditor.setLineType(type);
  // this.canvasEditor.setMode(this.isDrawingLineMode);
  // this.canvasEditor.setArrow(isArrow);
  ensureObjectSelEvStatus(!state.isDrawingLineMode, !state.isDrawingLineMode);
};

const ensureObjectSelEvStatus = (evented, selectable) => {
  canvasEditor.canvas.forEachObject((obj) => {
    if (obj.id !== 'workspace') {
      obj.selectable = selectable;
      obj.evented = evented;
    }
  });
};
// 示例 JSON 数据
// const textImagesJson = {
//   code: 0,
//   data: {
//     char_glyph_dict: {
//       不: {
//         char: '不',
//         id: '4e0d_不_1/4e0d_不_1_2850b8a8f5e99891950529cab2b8d3f8.png',
//         img: 'data:image/png;base64,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',
//       },
//       军: {
//         char: '军',
//         id: '519b_军_1/519b_军_1_8fec4a9896c1e8716efe53952150404c.png',
//         img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAOo0lEQVR4Xu1dBZCUyRW+JYu7Le7uB8EOOPwoIFiFBYKEOg4NIbgEDjk0OAQIcDgkBNng7hBkseBwENzd3fO+q+tUV9c/M//uzD/T/XdP1RTM/q3vff263+v33h/2+fPnL8xHXwrE0XfqZuaggAGA5jgwADAA0JwCmk/fSAADAM0poPn0jQQwANCcAppP30gAAwDNKaD59I0EMADQnAKaT99IAAMAzSmg+fSNBDAA0JwCmk/fSAADAM0poPn0jQQwANCcAppP30gAAwDNKaD59I0EMADQnAKaT99IAAMAzSmg+fTDVZ3/uHHjerx69SrRgAEDhvozh9evXye8cOFC7itXrmS/du1a1hs3bmS+c+dO+gcPHqR59OhRqufPnyd9+fJlYpR79+5dvI8fP/6KwunCwsPDPyRIkOBNokSJXiVPnvxp6tSpH2bOnPlG6dKlD7Zo0eIf+Ls/4wpW3TAVYwP3799ftly5cvvSpUt39/bt2xnsEuv69etZUPfo0aPFT548WeT06dOFrl69mu3Tp08B3QrLlClzIDo6+quwsDD5Ay8BANW+kZGRUcT0z7QK33sbOzE2bM+ePeW7des2Pm/evOdQJxhfWv0vSVrEVYGuym0BEPtr166tg1X/4cOHcIhk+nzkpcDDhw9Tz5kz57sZM2a0g3hnz7Aia9WqtaFChQp7UqRI8SRp0qTPEyZM+BqiPG7cuO/xhWgXv3HixPmENtAXvtgSIEF69OgxDluDKIF+oA/asiuZQlpOBZTyYyTm/4atYmLopzdv3sRnz4nZuTp27Pg3rEBWhsDxoXr16ltmzZrVetu2bVXpzDDE3zlfvnw5e5EiRU6I0oSY/m7SpEl/8rf9YNZXTvz37t17FCM8rcyPb9++jXfo0KGSjRs3XgJms2fFihU7NmbMmJ43b97MiK0ARF2yZEnjtGnT3mO/Y0Poffv2fRUREXFXZH7JkiUP0dniy9i0Gco6ygGgcuXKO3gJULhw4ZPsN1Z+u3btfjx8+PCvrYg6bNiw71GWTvZJYkP0BQsW/D5evHhveeanSpXq4eTJkzvRdgTtQDl6KjfglClTPhJXH+3njwcPHjyQ9v5U3lZ3s2bNFqIuqXzZYsIstNmvX7/hfL+QNu3bt59+7969tDFpS7aySgEAxBaZX7t27XV2mcD2bVL/CtplBJjfpk2bmXy/devWXX3q1KlC/mwldvt3upxSACAdvowIgBMnThSxQyTSHhJCbUR9T1uEVTt9+vQZicMmzhv169dfeeDAgdJ2+lOljFJq4K1btzKKKhOMQXbUKBiAoDYy9dFOHah8sO5NmDChGzF/VbZs2a4qYdyxM7lfyigFABL1EeLc7Jpcd+3aVYnVBWPt0Aj2hU6dOk2xU1bVMgE1gTpNhMePH6cU+7BrcNmwYUMtX+ODWXnVqlX1jx079qWvsm55rpQEePHiRRKR8KIV0IoxFy9ezEW2glJWz+7fv5924cKFzRctWtQUZXDRkyxZsmfYbhInTgyDkqs/SgHAyuxqhzvDhw//HoxlZbdu3Vr9zJkzBTdu3FhzzZo1dXHLx7fz7NmzZABN0aJFYe1z90eV0yrG2blz57+KWgCBIoG3OWzatKkGTvFiPavfMCTRVe7fUccNKp4d3iolAayubSEVcJljtUyxnzdv3nwhv/qtykGT6Nu3719atWo1FxdEbjvpexVhdlAiS5muXbtOEFfupUuXcojjg86Pst5WfsGCBU/36tVrdM6cOS+uXLmyvi4rXqSVUlqAlcoHTx6GcKz05cuX/5YsficnTpzY1Wrl58mT5/yWLVu+IUte4dGjR/cmAFzavHlzDXdv9J5np9QWkCZNmgfiVOiGrwndxB2Gj8DYsWN7HjlypISn6ZYtW3Y/Dn5w4WJlsK2QZbCkrgBQyhS8evXqulaHN5hpfR3yyIp3xerOoEaNGptwo2e2AAWWQJUqVXbgwCYe0nz59MFYtHTpUvgC3BenCasgnD+tzMwKkMTvISp1BkiSJMmLHTt2VGnUqFEUAwLctzJlynSTvH62ku/fBPL8aQOrH68Z0FXuCHjrWlGLGZdwV+A3NVVsQJYTfkzHAZHNxLYovnfv3l2BbQk47cNryFP7OXLkuISy0P913AaUOgTyC4zfBsQtYdSoUX1QFn8nH73O5MXzzmpxEjDiw1Ucz2AKhpTInz//WUgF3AvgGWIF4GSKbQYOpZAyKi50j2OO6cqTvTzvNFqvXr1V3lY1qX/f+Do88s9hV4DXkew0iMn4lNICfE0Mp3w6G9wB0+CyRfb+AlZ1KOonNVzISB18YhcAYH4gPIp9zSHYz10FgDp16qxhDG3ZsuV8kZjwBILTKO82bgcAWbJkuQbJEmzmBKM/1wBg+vTp7XlmMhdtutlLOnPmzDZw27bDbL4MXQe/gKSgM0HiYDAjFH24AgB0YEtPd/iw7v0c+kXRPq+mTZvWAV7ApDo+jynjUR51KVA0UyiYEsw+XQGADh06TLPDZOzjZDO4gZXtqTyAhMuhYDIhlH0pDwAK5U4nBmuIzM2dO/d5+PUfP368KIJFISGsAACTMvkOVgwlQ4Ldt9IAgIpHlz/FxWCR9OnT327QoMEKyiHQHTEAKIfIHfLu7eoNLHRZFK2bMUhpALDVAq8gcuQshhgBqHj4O28pPH/+fO5KlSrt5Fc9YgSqVau2NXv27JfZ36FFBHsFhro/VwDAExFhAh40aNAP8ePHh8fQzwdEnAPI82cOWfkyAyRRUVGR7BluBq3agvpIFsKfYFiCEwk0DrpvqIkoYdUlhmsBAKbxgaNgMkLDEN3LMw1SgwGgfPnye6wA8P79+/C2bdvOsPIwgpZBJuQDsDuQCbo3rqzhpaQKMFwHADBryJAhAxCrzxgLw8/IkSP7WF0KkfdvTlYOALECANtOsOqt8gJYHShxLqG7g/UYy86dOyvxeQxCLfb5/l0FgLNnz+bDauQZgnBynAE8Ef3cuXN5WXmoiN6YAyCQ/0AcqIlNmzb9J5xM7KifKEPX068BiLlz534rU/oYVwAAjEGMPm/ihWieMmXKH8Ewb0zF6mRMhIZgV3RjRW/fvr0KNA67IGDlEF0sixRQHgB0XZsFp3lx1Vt5C1sRHfs2X9cqdwC0DJiWkSCiS5cuE6Eu+rI9eAMFtie7QHMaKMoCAAScP39+S/5GDxY+SAJfq54RFTb+XLlyXeCZRd5GS8lbuFf37t3HIRw8X758Z/nUMzFd7WJ5ijt4hjQ3TjPWbvtKAgAqHBJD8MStWLHiLiSJsjNx7MErVqxoUKJEif/4y1Bv9TNmzHiT/Bi3U4TxZKiOyGWEQ6osqx+0UsojiAYcNnv27NY9e/Yc+/Tp0+RE/C/g7UO5f/ojZRtL54a/ix8ifFz4Ey5btqwhvvDysSpn52/wQ8yQIcNt+CXiS4y+RVfG1+GbiHwC+D8ZmK4gBZ2d9kJZRhkAIFiTcvL8SKneqjGCkY3/wuLFi39HK/mIVTgXUr7CQXT9+vW1EfyBoM+YEBtxCMgpSPaEU+gLQSRgLBiN/lwRQmZHZIayDPZz5N4TnThgzcNdPz82iNaDBw+WGjhw4GDc/9sNChXFOC6FKLKoC8R1KOcejL6lPgPA1Cra8OHFC4MM20dxkMN+jkRO2HO97ckknq/D+3fq1Kl/QL4huJCJjiSoj8OfTPu0k0CQFgBQuXgnD6zm1q1bz6Lkzlkptq/60KFD+0P94+38IvNx7VuzZs0N48eP78ZuBUViwplErDdixIi+ThJdpralAwB0boh3K2bCDMubeK1WOy5tkEdg3bp1tSmnbyI7xBZDy2Cts1PPDWWkAgCucmFkiYlqBksczLLw+4vt7RwSTfJ96uQRJI0WgBN61apVt9PtXFFvJ3WkaqNbu704ndP5YFeBAgV+8vc0jlxAT548ScH61SE3EJurNACge/vBIvMR1IlYf7yAAS+I+Prrr3dnzZr1mr8MFwEmZhjxlHEkJiqkKmWlAQCMOwjNQrgWXr9Cp/3L9JKH/wIEgWa4yBw6SCIB9P8/4m9VmBmbcUoDABhXaC9fFJtJ+FtHzDVoN/egv/3KUF+p8HCnCAbTLt+2+NupfmVo1wCAuCAmm7STfFIG5gViDAYAREXxEsnbpVIgiC5TGwYAFgBw+tBpACATBSzGYgAgOYMCPTyR4QYAgaawYu0ZACjGMH+HC08jf9tQtb45BBLnDABUhW+Axi0CwGwBASKsKs0YCaAKpxwap69Usw51K0Wz5gxAbBABYLYAKbAZvEGIr5EzAAge7aXoyQBACjaEbhDsjaJsBEYChI4XIelZBIC5DQwJG0LXKeIG+d4NAELHi4D1TDkBi+GFkHZ0fBEAxiEkYGwIXUOU/atRkyZNltjR8cU3h+okAaQKDAlkpA3yBsLMjygjX3F+SNqAsuxL7xBKGcixyNyWawEAorP08XiJpDcmiOFmYtSxzAz0d2yuBgC9HLIQS++CgE8rSYDwc3714/++3kfsL9Flqu9qAIDQSM/CGEzZRb4TQYDVLgIAeYVlYpKTY3E9ALCfR0RE3AWTkR8YUcM8CJBvSASAkwSXrW3XXwZRxs7HeHMY9BEYfPDOwb1795Zn6iFFJKfhdRVPbxgLnT7jcM+yIdKp8TRs2PBfbKUjtVx0dHRZ9CW+jpbiEh84NQYZ23X9FsCIjtwDSAXLQIDsIf379x8aGRkZxW8BSEEjI6OcGpM2AAABkRbWV9LHUqVKHXSK2DK26/ozAL+DUjLJf1PW8D9721WR58/hXVeq5rUCAK55kVCSkk3N9sQFetfwGak45PRgZBRLTo8Jej5eACGqf/hN2UQrO92/TO1rdQbgCQ9bANLJ86+QK168+BFf9wYyMS8QYwlDIzp/8JbwefPmfYt/sT0gCZVO9NAeAIzZMAzp5ArG5m0AoNNyt5irVlqA5ry2nL4BgOaoMAAwANCcAppP30gAAwDNKaD59I0EMADQnAKaT99IAAMAzSmg+fSNBDAA0JwCmk//f9KHs0pCfxy3AAAAAElFTkSuQmCC',
//       },
//       征: {
//         char: '征',
//         id: '5f81_征_1/5f81_征_1_82511596bdf6700eb9ff1797cfe22cfc.png',
//         img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAARtklEQVR4Xu1dBbBVRxLdj0NwlxAsSCBAYGHx4FJBgxQfDRC0cFggQIAAAYIF9wTXxW03wOKaxS3B3d2Cy/ahaqhh8t61d+97M3lzqyj+/3emp6e7R1pvxJs3b/6mn/ClQJTwnbqeOSigBSDM5UALgBaAMKdAmE9f7wBaAMKcAmE+fb0DaAEIcwqE+fT1DqAFIMwpEObT1zuAFoAwp0CYT1/vAFoAwpwCYT59vQNoAQhzCoT59PUOoAUgzCkQ5tPXO4AWgDCnQJhPX+8AWgDCnAJhPn29A2gBUJcClNMQoS72cmCu5A6wYcOGUkOGDOl68uTJzHKQUV0sIlTLDDp16tTHuXLlOvTkyZPYKVOmvHblypXUEREROr3JoQwqtwP06dOnL5iP+V67di3lnTt3Ejucu+5GFFBqB7h48WLajBkznnn58mU0xr3Hjx/HiR079hPNTWcUeEdIZ92D22vs2LFteOanTZv2oszMf/ToUdy9e/f+/cCBA5+dOXMm4927dxPFjRv3UWRk5PzPP/98S3Cp52c03AFU+EfE/CBRokR3aBo479/++/LLL5fIhDvtRrF/+eWX8l26dBmSP3/+/0WLFu0Fjy/7OX78+PcfPHgQTwbclWA+CDV+/PhWIjHHjBnTJtREvHr1asqJEye2qFix4irajR77Yjj7W8yYMZ/Wr19/1m+//fZJqPFm4yshAK9fv47ImjXrMZ64dPN/fe7cuXShIOS9e/cSTJ06tXHZsmXXRo0a9aUR07ELlClTZt2kSZOa3759OzHmEgqc/Y2phAAsX768ikjkggUL7gwmIcE4bO+1a9eeb7bSgWvhwoW3Y9e6ceNGsmDiaXcsJQSgWLFiuDC9O/vx8+jRo9vanayT9vfv348/atSodpkzZz7B45AjR44jLVq0mCjeS7JkyXJ827ZtRZyMFYo+0gvAzp07C4rMjxMnzh/YTr0kGBmYUnXt2nVwggQJ7rHxMW6TJk1+/vXXX//BtnLsCPz7UB1LTmkhvQBUqVJluSgALVu2nOB0wmb9yLCUqFu3bj/w2zxW/4gRIzrgndi/VKlS6xl+DRs2nGEGX7b3UgsA6c+5cdnjBQCXLvIBfOwFIWfPnl0vWbJkN9h4JUqU2Lhy5cpKr169iuJvvFSpUl1h7dHfC7y8hCm1AFSrVm2puPqhRrlNEBwnlSpVWomxokSJ8qpGjRqLsM2bjXPr1q0kPH7Hjx/PYtZHtvfSCsD+/fs/E1c/mGOkQ9+8eTPpli1bil2+fDm1HULXqVNnburUqS937NjxR+wuVlU18kqWZAIAdY+slFHtjCtDW2kFwNfqr169+mKROeQYijVr1qz60LWZTg5B+f7773taJTC2eKtM52HCEMUEIH369GetjidTOykF4ODBg7nE1Q9Cb9++vTAjHm7buKUnSZLklj9DjNdbctu2bUezsQsVKrRDJsZaxUVKAahVq9a/RKZSDMBBrFLo2FC9/NnZ+S3Z7lFglWisHbs3YMzKlSuvsNtfhvbSeQNPnDiRZfHixTWIqO89L168iJ4nT579tDvkFt/5+p0ui7PpXMcN3bPnwoULHzHgCRMmhL1AuUc6ARg+fHhnWul/ClT5/fffP7FK3ejRo7/o1atXf6vtnbZDNBLrSx6+B07hhLKfVBFB5CKNT7p0fSsESZMmzWW66H0Lfzt87HwfMtFOQuCIFThO29DFMSqpj1AD3z4iDk7hBr2fDOcQw2HatGmNiADv2fzF3z/99NPD06dP/+rZs2cxcCeAl41vA9s81EGv5wU3MD9u3759e3s9phfwpToCMmTIcJZUOOLrn48AMrlu6NSp049ffPHFv1kQKAlBzEGDBnXnVw1iBpMmTQrNwNOHX/0YiPwEiAVQ7/FCqgKBiV0AETNYXfCsde7cedihQ4dy+oI5ePDgrvwqzJ49+9Hnz59HD2R8q323bt1alB9bhuAUq7jz7aRUA7G9w8BjNKFLly6loXP3Ic+EdevWlXFCBCd9VqxYUZkfe8qUKU2dwAl1H6mOALZ/xogR47nZXtq6detxCLpk7ch+v5isgf816+fWe4oTSMDDonCvZ27BDiYcqbQAqxNfsmRJdYoSqsra4/yF+mi1vxvtKCwsIQ/HitC6Ma7bMJQTABCeTLBjeEJ88803P6RLl+6828QxgifuALA9BHN8t8ZSTgCgCfAGGDCewrCHukUQq3BEASBH1CurfWVqp5QAUFBmBdISGvMEJIfQkFixYj0NNlFFAQj2+G6Np4wAwErYvHnzyeLE3dT5d+/enZ9CvzpaIe7Dhw/j8e3wO93olUtXl1IL8MUAsgcMR26g+I4idtuT93ChGxnCuEsg4ZQCQ0aYCYEoAEhZp8CSeeJRAIMRua7T4x/wv379egr8DTvI06dPY1HQ6f3GjRtPK1my5EazMT15H2o91Mr40O9p8n5NxEeOHMlhBY5RG2JGTLrIPSev3l0rsIhhG0ScUqRIca1IkSLbkBZGVs0zVvIHAAPRxvTEsTKu222kNATxk0ROIIhpJAADBgzoEShhYG1kY1gJ7QKTjXCy8w7BL6HKFZT+DgC37tmzZzOI2x+/1eJyGOj2iC2awcB9wwwerdgPzNpYfV++fPk18eLFg1Uz6I/Ud4A9e/bkwxnPUwV+dzK7NkNgyMCBA3vg3a5duwqCIfT84ZSCvGqJ8528ineNYFkRAASJFC9efDPtFrs//PDDSzj3UdqGIpXSMNgwIJFPo5tTvAPuF+jW6VV/igCKljt37gP8Vorzed++fXkwJs59/l2gfoB+/fr1YvAo+CSb2bxI+7jpa5snlfQJsofWr19fCnPg4SCxhM8jQH8SiC5mY3n5Xto7AM51nsCI+F27dm1ZnhiJEye+zdr079//20AI1b59+5EMFkLSzWCB0aIA5MuXbzcdV+l99YUwIJuY71OzZs2FTqKRzXCz815KATh27FhWkcDfffddH3FiyNxhBK1ateoyOxMX2yKti8GiI6WAGSyR+XSGPyAVMoW/fuS8Gsv3yZs3715ccM3G8fq9dAKAFVG0aNGtPLGQau3rZo7sXNYu0Lh8Pg8Bvn4jwkNlEwUA276/Psgr5NtDq0FEkdfMtQJfOi1g3LhxrSn0G8EWbx/E2s2cObOhL1s7H/eHW7yVi5m/SxPvWkYEst0LIG3/e3z1WbhwYS0Ysdg7shVcX7NmTXmUuAv4AucCAKkEAEzs3r37IH5ew4YN+2emTJlO+5orbtb83+noyOaUJrwAIODTCA4rU8e38RUVTHeWcghPZyFudGe5Q5fVspRtfNIpnm73k0YAaLuKaNq06U88IxDg4cv+z4hAmby4ib97kFPglEAoN8f6mgkATLjiOOKusXHjxpJ0rCyjELUYaAsBgb0iZ86ch53i6EU/aQRgwoQJrUh1Ks0mCcMI9H0jG7+oq6OKqFMi8avaV1AqDxfBqOI4vOBilSN4lcEE87Htwx7gFD+v+kkhAKdPn84Ety4/yaFDh3ahi905o4mL2TioxeeUUPyqNhMAtqr5sViU8IIFC2pTytgqBg844iigmka7nOLmaT8rN0Uv2+B2DwcKTfKdsweZvlb0YxRg4vuR1W2TU1yTJ09+ncFCUQgjODt27CjEj4ufCxQosOvrr7/+if87ik1YsSk4xdmNfiFXA0WDD0LCz58//5GVySF6mCc4RQeds9LPVxsWig54iPg1goMaBKIAiL9TFdMLMtUD9DefkAoAPHBwwfLEQ16AHSbyWcKwFhqVczGCiyKODA+UpTNqyxeG8CUIyE+gxNG0duYRqrYhuwPg1kzWt5n87Rmh3Y0aNZpu58zjc/JweycDSyo7/Vlb/lyHRmIEw+g9HWfbyZBUDHWMneAR7D5BEwAYaTZv3lycTbBnz54DUESZ/Q6dfvLkycjzs/WISZm8V88qIDCfZ6pTASBz9HJoAND3rY4d6nZBEQAQFLd86Mb4GSoRH8ePfEBY+5wQTnQB08UwuV2i8ioc+poJgC/4dAH8GXUNZK5e7gvvoAgA1DysbnzpA3n+iJ3jVS3E4jmNiROTMqlyV1K7AiBG+JrFF4pj9ujRYyBsFkqGhgfj8lGvXr3ZWFj4X/Sjo7aO6De3g5OoQo4cObK9nf5oi7Iz/GVu6dKl1YxgQHVFeRhcOpGganc8mdp7HhFEKl06GEewKufMmVOPX50wksydO7cu3eRRcdvRIx4BYrSuFaAoMsG3w5Fk1A8rnVTFKoFGIVnBzes2ngsATLz8Vz74CVGd/ZZm1j4zAohnLm/TN+vL3s+fPz+Sb2tlK8cxYacqCI48hIQj7ByaCu4qVMgiGSyI+O4RviaCWETcR2BFhEaDhQFtArkKgdLJHy08FQBMmmr4NfB3aaJqXwusMslfOzEr15ejxmgM7EBUkBqWvXePFQEQYeLiiLh/Kk2XFSZpBLLCu4lCUvg7mG7mZPKFJ3Ynqpa+FSlxgdLKV39PBQC3fV9qGZV5OUIFFdramRBWDhxEuIDxlzRRAHzZ6f2NA+cTPJDie6w8MNTXZRC7GZxOYDS8j3BBk8Uv+9GjR3M4OX7MaIAdDlHDZu2cvvdUAPgUboYgPGOLFi2qaVddgkNl06ZNJehLHU34yYp5gVZX2YwZM75CMSlfnj0wHsw8fPhwTjCXMRsMx+o2CxhxygyxHwphzZs3rw59m+CoWzD/JOxeAQZc5Nrx8EFY6Pv0+ZfjdsfFcQKmwZ6QLVs2fD7m7SPuAGaePBwRSP3C/cMfDgjiwBltBstoDqhRiEAW1D1CBjMMXewfooGAd4MGDWaR4wmVRt578K5NmzZjkROB1DG7tLLV3kuVRPyaBhl/Ojkdjy5q0CTetGvXbhQPg85GhFu98yQ2a9Zssr8xEEqOKmN8+0B+RkYP6hihujgxqx9pOXXpzM5rFuwJTyfCwcVyuJQj8KxVq1bjg+lH8NQZxOv8vXv37uuU+ejHPHAQKp7AZERCCJmpAODLXlZz9XwJBQpQ4zMx5KuYhs/VAB8n6VywIfA1hjEWHGL4CIZVL2ggdBT7eioAqPCF8G58PClQpHnfP77YxeBh5RkJAL7lV7du3Tl2VzpWJ5Wm3Yc5wD1MalpCKzEKRvPE94cqVKjwH4YLDEkIRydLacZA6eO0v6cCAIKBcE6RE/vR2XkVxCtXrtwa9o7P6ME7/gjAhyDsJHHSmX2KYhAn4bhxu9gkEkawgwBH7CYoeI14gUCFKlDaeioAgSIn9qc4u9UgIM5KJliUH4hCke+OAFLrprB++L6A0crHcYLK5OSnaOYvo8eNOSDRBBFH2OpxhCD1LNSMZ/NSSgCQHcQYilWKSeAyxTOZii1MBXFx1vJBHkxw6Ju9mwEHYV1W0sADFQDKC6iJugE4SoJ5ubOKt6d2AFvqiIXGlAq2iTVbtWpVJVgSRasd09Fhz4cHEno81C9KND2IqNxg1hOCTQIqL+wHMGKZeRktkMD1JkoJAKWI7YD9Hfby1atXV0TYtairg/GM0Ig4cp1iNgBCOGH1lJHxbBpBiQewQTPDpqjFx6qBwnkCi6JYsDFUhRb8IS4z84GzUjsAEEbCxbJly6rh5w4dOowUXcmeW87ckmZJ4CgnAEi6wKqCswZuVJGOqn66JVTyoNQRACJRhY2rRilWTuIKQ0V8GcZVTgBANCRd+iMeBEQGwqqCg5ICEBkZOd/f5cpfKrkqDAk2nkoKAFyspUuXxle733ugIsqUex9sZjoZT0kBwETpE++DxQlDRTQL6HRCpL90H6smQxnb8ZW9KDr4ESshJyOusuIEfUpZAYcqCJMwYvSgHurt3z4rlRYA+9PVPUQKKHsH0Kx0hwJaANyho7JQtAAoyzp3ENcC4A4dlYWiBUBZ1rmDuBYAd+ioLBQtAMqyzh3EtQC4Q0dloWgBUJZ17iCuBcAdOioLRQuAsqxzB3EtAO7QUVkoWgCUZZ07iGsBcIeOykLRAqAs69xBXAuAO3RUFooWAGVZ5w7iWgDcoaOyULQAKMs6dxDXAuAOHZWFogVAWda5g7gWAHfoqCwULQDKss4dxLUAuENHZaFoAVCWde4g/n8sxcVZAaNl7AAAAABJRU5ErkJggg==',
//       },
//       怕: {
//         char: '怕',
//         id: '6015_怕_1/6015_怕_1_eab91a2742729b86d70b23702b5f12fc.png',
//         img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAASXklEQVR4Xu1dB9RVxRH2p/feO9J7FwgdAqH3Kl2QkkSCIYByBAQiwqFoiIIISAfpvQYQBARCkV6D9N57h8z3H5ezrve9d9/dfd5d733n/Af+/92d3Z35dmZ2dnZu1KtXr97wP97lQAzvTt2fOTjgA8DjOPAB4APA4xzw+PR9DeADwOMc8Pj0fQ3gA8DjHPD49H0N4APA4xzw+PR9DeADwOMc8Pj0fQ3gA8DjHPD49H0N4APA4xzw+PR9DeADwOMc8Pj0fQ3gA8A8Dnz//fcVnz59Gse8kes3YiM1QPPmzeceOHCgkH7sNG9ERgLg5s2bKXbu3FnKPHbrN2LjAEBp7FHPnz+PtXXr1nL6sdO8ERkHgKioqOiLDDt27CgNMJjHcr1GHGXixZDYsWM/gxa4e/duksSJE99TwdLNmzdX2LRpU6W0adNeKVSo0IGSJUvuihUr1nMVtLWmAQCY9hMvXrxHxNRXW7ZsKadq7MePH89FQt8JuvhJmjTp7Xbt2k394YcfyqrqQ0c6xgkfTEyUKBFW/auvvvqqq0qm0tYy9jvvvDOJgYD9O3z48D4q+9GJlpEAwOqEcN57770xqpn58uXLqI8++mgID4IECRI8ADhU96UDPeOcQNhTZpuPHDmST7V9hZM5ZMiQ/l9++eVfGO2HDx8muHbtWmrVfelAz0gnEI7a1atX06RPn/7SxYsXM0SKkUmSJLl77969xKB/48aNlClSpLgZqb7comu0Brh06VJ6CCYSzEOkkQk/bty4T5InT34rEv24TdNoAIB5+/fvLxwJJq5bt+6PjG7+/PkPs/hDJPpyk6bxANizZ0/xSDBw1apVtRjdcuXKbY1EHzrQNBIAceLEecqYh4igakZC9ePEkdGtUaPGWtV96ELPSAAgEsgYuGHDhqovXryIqZKhK1eurP3kyZO4oElbwIfVqlVbr5K+TrSMBwCcwKVLl9ZXydRFixY1YvRq1qy5GiBQSV8nWkYCgDcBYObH9Hn27FlsFYxFogk0AKPVpEmTBSro6krDSADwJoDtBAYOHDhIBZPh/bPtH4Wc79evX3+pCrq60jASADFjxnwhMvTTTz/9cM6cOS1kj4h59Y/VDxDoKjwl49IhHs2PgVR5LArwpAs2rqpVq8Ipiz61o/35S/Z/nBISCJo7nRM5kzFSp059ldGj4+GKTmmZ0k67w6D58+c3KVCgwMFgDCSvfB0TUu7cuY/RWX75vHnzHmF/o23bmmPHjuUOVwi09avAaIAeDobCpRHseTpTiH/69OmsFMZOrZKuDC3tANCqVatZ5OQ9sQuAzJkzn4WgaDeQIk+ePEeZAHGCN23atLbhMOf9998fzdqPGDHiH+G0tXoW49q+fXvpPn36DC9SpMjeGDFiwHRFay4AbPHixQ1k+5BtrxUAoIIp5n6TTvue2QVA/PjxH+KoFsx+9913v2YMZuZh1qxZreyu5GzZsp1CO3Iyn16+fDmtU+bSAVX6Tz75pF+uXLmO8+MR/0++zPONGzdWctqPinZaAQCrBUxCwkewyVWuXPk7nplY6Vi9vD/AvsezdhhFZwpIM49enQ0bNlxkp434DHwGSlmfAwAFEzz/HfwZJ32paqMVAGg7PxDMgVoPNsFSpUr91w6DscJmzJjR2g6zhg4d+iGjSTuBhnba4BnKTYz57bfftuDTycSxQUuxLCbxO4AFNOz2p/o5rQDw1ltv7QCDwMxgE82YMeP5YACAJqAI3iq6O1DSLsMqVqy4CTRTpkx5ncLAcUK1w25l4sSJnXLkyPE/cSypUqW6htSyuXPnNoM5YLQoYlnPatxXrlxJE6q/SH2vDQDgGTMnqVGjRgsDTXj37t04/YtW1VY/EPyuXbtKhMMweOdwPEGve/fuY4O1hZ+CFS/ad4y9bt26y+DYWaWPMT8EPo447pMnT74ZznhVPqsNAGDHGWN69eo1MtAk69Sps9xK8HAcv/nmm45OmEMHSlUYzWB7/7Vr11YvVqzYHt7XoKyhOz179vzMrhCtTMXhw4fzORm3ijbaAKBly5azmRACZftOmTKlfaCV37dv32FOGYItH+imSZPmipU9puyggtAsfN+UjnaRoo8f3L59O6ndXQbGBy0hzmHfvn2FnY5dtp0WAIA9TZYsGVKuotU6AjLixMAk7O0DAQCmwSkzOnfuPAF027dvP4UXJmxzly5dxsOZZP1iqzh27Njujx49iuekvzZt2kwX5yAzdidj4NtoAYD169dX5Zly69atZPwg4R9kzZr1dDDbf/369ZROmYHIIWhPmDChM2jAJ8CuAOqd9ZklS5Yz48eP7yKbHg4fQ5xHOM6q0zkGaheLBuP6Z8mSJQ3YIIjRZ0kbIO8/+oPj2caNGy88c+ZM1mADlTmzp6BPOtDGNbPPP/+856hRo3qdP38+E/6GsfTr128o3UH4N501PJZlVsKECaHFfvEhrePeoZxqRIVLDyoXq4utCthInkbbtm2niSsGWy++Db5/8OBBgnD7Zs8z7cKHakETV8NUb9Ho2PpjcT4IgDkdu2w795D38xrAPf+zZ89mYUuCvOwf2f8HDx48YPr06dgdvP5QvB+HPxUotr6P/zsuizpdnazaCFuJGTJkuLhmzZo/TZ06tT05hjgdVPahoBDuNWqjARwzTRVH5s2b14ynRVE+XNB8A4JHpg//HdKzyV+oli5dusviJQ1VJWMALGQE49KJqjnydKxMFa1i1665u64BFixY0IQxiFTwy7Jly25Doid55hN5xlDg5QQTPp4XEzVkAMCnmCGxJFLCx7itNIBnAUBbuyKnTp3KzgCQPXt2+vVUdjh9vEAzZcp0noIwNbDyGbNEZ4pl8TpZtbxQ4IQ6ocG3QZZyIKFaOZJuAsBVE8B7/2AgMnyrV6/+nzt37iRlDKXY/A3YY9p/n8bf2A0dcSXJaABemzx+/DieXQCgVtHevXuL4gdXyXBZlSKCOTAP5C1WqVLlO/gxdMaBw6voD66ZifQ9C4AVK1bU4ZlBUbVkor1cvnx5Xdh+kWkiAMIRnEgLl0DZ37DdLFGixG7xGYpNJMctJAralKCzhpL496effnozEFgASAAX5oyKT+RmALaqOuLmtTPXNACEDUYGYiASP5HkWaZMme1Wz4iqVMYEUL0BBHyiP3BKsXopdSsbBEypZXkOHTpU4Ny5c5mdrNRKlSptouPtc4y+mNFsV9tE6jnXALBt27aygQIgWBGTJk3qRDEBHPxYflQCgA880UlfS/yoYDgc2oULFzbms5itMpo9qQGwsgIxGZE4istPDSYEEQAyJgB+RiiBQ3CID+BZmB+sZPQJ+2/lf5QvX34LTJxYxMoHwM+cDuS0oToHpXd9FkogKgFACRzX+f4gJKxeOG/FixffU7hw4f2UxHlUVN8wCRUqVNgs1izEdTJsb632/NjqinPzpAawcuwGDRo0kOrz/DOU8PG9eD1MpQagRM3KuBIeSjBwUEXht27deubkyZM7BrL1VjStQGGHByqecS0QVKtWrVVNmzadj0nAMx4zZkyPAQMGDLY7KXE7Rcez8e22FZ/jfQB8B+GFEj7C1x06dJjC0+rRo8cYRDDDdfTcBIBrTiDULOXMNcddPAR4UJwxHAGKTJYBAL8LwBio/mD50qVLIz/R8oMdB66NIQ7AHoD2sgNgq51EKLCFw5dwn3VNA2CgmDgCP+EKn61SfrIyJkCs/0PFIf8QjJGUJPI128ICyJQg8udQwmeC1w0ArmmAcJEqPi8GVGQ0gAgAVAeBoKxWJqWP9ab8xXYYD8zQ7NmzW1ES66Jg80FJW+wIihYtutdq6+tZDSADAnE7JQMA0Qeg7KJUJ06cyCWOb9myZfUo93A4/g6zgVPDQMIHgHBs3alTp0mUxn4BIWHsNvxIoIzUubaR1ADoBtXH6OIprnZFf1CLqEWLFnMgWAgSYV5sEcXpoH4hJbV2w04A0UR8j9Dy6tWra6KdHwdQBACRkTI+ALxwnAdAVbPh8aeUOOTBrgV9IEEEx9IFCxY8yE8FGmj06NF/HzZs2Af3799PxL5DNBNmgh04WSWu+CbAAShUmgB0L0YDWewfqxiOKg6DABIcS/PCh02fOXNmawSKEMPghd+1a9fxKDjBnzb6PoADYVs1EffOMhoA9MVoII51UR8Ywr9w4UJGBJ4Q10dUEM/jzB+/Q71TqvcMPq0N36NkDUyBaKp02wVokRbOJzbSkWsxOxct6IQuP/H59fUw2pfPl0mQJBW/kqeHiuSs6ARuAuFSCsaFWzy4xIpEUqvbyKBBMYTtgeZA0UMcgf/iWtvBgwcLyIxdpq1220C6zduGKoQcEkO9ohYQNYDMLgC0xeRPJKWwxBScOyBoBRXP0sX58TAbzlY3tAdlKSe0qi9kVdPQyjFUpChDknE1EGQ1OjDTzhvBIg0A0cFD6ThR+EhMxaklcghwKsjMA7aRX3zxxV+t5mflBPoA4DiFXD87bwRT7QMgHB1yudADCEEjZxHpbKhWTqahA8LCED5sPqOBgJGY4YTvfACE4DJUMZJFQglD9S4gVCYwnMT+/fsPwa4AR72oHyiaKRwhs7rCOCcACMR5WBW0dFMDaOcEwknCLd1QjiDl7uEyyWtnCgWiZJwhvkIYT5cSOu7S3r4vbe8ShhoT+qdoYV3WnrTZfb5ABL6nAFEH0Qkk05JRZuwybbUDAPPu8RavYBMD03hG4qqYDCNo34+7gL/wzrETwHjCoQuQ5MyZ8wSj1a1bt3F8e1x9F/uRKUgVztisntXOCcTdAKjNUH6AylAw+kO8XvTa33777Vn58uVD/UHbHzixyAtgDaiMTGc+/c1qt+Lm+wm1AwDy7WCPcZASjOsq8wHQDwTH30vE36iC1wYnYVocAFHF0WvM6evdu/cINhdsD8V5+QAQOIJDGCRl/JYAQF/8iyGwy6AScxttL33uQeQCUpmbUexPOEXED363eseRmwDQzgeAnYLdhJ0MZhtRoUO0pXactGA2E/3B7iPCV69evaUy9hVOI8rIsDHCR6GdQXJELMVx26lKJjOWYG21BAAVafgbmIS6wYEGj1o+IiOdlm3h+6AtaBmy/TNR01eW6ePGjUNc4LVjSQkhP/KlcNh3qDwm25fT9loCANW4wBxypv4VFL2C146CTU4ZwdrJahG+f9Q+4otYi4DF7yhKITtmmfbaOYGwk0idwr8sNSuQHRYDKDLXw1gfTpy+QOODbR85ciQqkAX8WF0WdeJ3OG4jg55ItkU1UNhiOpJNFagf9hZxtrLoSBb397TTarVr115htfrxNxSOdHPMWmoAoBmVQogxUbhdG2yF8d+pem+Q49UUoCHuPFgVhsDjeA2u6v7CoactAKii5i5MBOlXgSYkxgJ0BQAVtTqJpFCrebj+Sjo31U+wvlntQCReBHoOZwa8anUzsSIUH+Hp0wHSEn68ZP8fU/ZxzlBtI/m9dvaSTRb7aFahE6VarZhApWNw7/71NsvNkqt2hIRSds2aNZuLMaO2MV0ja2OnXSSf0dYEIC+A7QZw9g5/QFShoglQ/QbRcGypnWcRIURmEVLMSVsVRC6hnXaRfEZbAGDSqK6Bfykg1NRqeyYCQKZWYCSZLNLGtXPUO/wt+wzUl9YAYA4S0q2OHj2aV5yEGAfQXQPoIHBxDFoDAFW2WKAEyaI+ANRDSGsAYO8MEGDauJApXqoQzYKvAcIHiNYAwHTYu3txUwf38aycQTZtHwC/QwDQK9wWs5WOrFt+1YuBn2DgCJ813mihvQZAdhCrFYiaPCi6yERDL3ZI4A0xRW6W2gMAU2/QoAEiaG/AB6A3efRj7OBv8+JvbtbaiZyIIkvZCADgIgZjA4owIV0MZeZEALiaXx9ZOUWMuhEAQKl4VowBWgDVxXDpQtwVhFudK2JcNYiwEQAAP+nVMXjbVvSHXuOS1qqeoOvJFQYJng3VGAB07NhxsljLR+S3zIujDJSdkiEbAwAUZeJTra1mL9blVcKh3zmRKBw1mvJBzh98ASrSgOIQv/rg0oWvBcKTpjEaANOCjcc7BPgXPLDposaPL/zwhI+njQIABozqIQgJo3Q7P91Q5eXDZ403WhhlAniRoBoXqm+iOBNeKkWZNvNcvWJlKF6MBYCh/NZu2MaZAO04aPiAfAAYLkDZ4fsAkOWg4e19ABguQNnh+wCQ5aDh7X0AGC5A2eH7AJDloOHtfQAYLkDZ4fsAkOWg4e19ABguQNnh+wCQ5aDh7X0AGC5A2eH7AJDloOHtfQAYLkDZ4fsAkOWg4e19ABguQNnh/x/RMUEoGZuHwgAAAABJRU5ErkJggg==',
//       },
//       红: {
//         char: '红',
//         id: '7ea2_红_1/7ea2_红_1_bd3243accba1b58ef1bf5c9125628ea5.png',
//         img: 'data:image/png;base64,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',
//       },
//       远: {
//         char: '远',
//         id: '8fdc_远_1/8fdc_远_1_4673317c36d584b29295333c61542faa.png',
//         img: 'data:image/png;base64,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',
//       },
//       难: {
//         char: '难',
//         id: '96be_难_1/96be_难_1_fad2d6e4eb21269f42e7a44e6782feb4.png',
//         img: 'data:image/png;base64,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',
//       },
//     },
//     chars: '红军不怕远征难',
//     layout_data: [
//       {
//         char: '红',
//         x_offset: 0,
//         y_offset: 0,
//         z_index: 0,
//       },
//       {
//         char: '军',
//         x_offset: 115.2,
//         y_offset: 0,
//         z_index: 1,
//       },
//       {
//         char: '不',
//         x_offset: 230.4,
//         y_offset: 0,
//         z_index: 2,
//       },
//       {
//         char: '怕',
//         x_offset: 345.6,
//         y_offset: 0,
//         z_index: 3,
//       },
//       {
//         char: '远',
//         x_offset: 460.8,
//         y_offset: 0,
//         z_index: 4,
//       },
//       {
//         char: '征',
//         x_offset: 576.0,
//         y_offset: 0,
//         z_index: 5,
//       },
//       {
//         char: '难',
//         x_offset: 691.2,
//         y_offset: 0,
//         z_index: 6,
//       },
//     ],
//   },
//   msg: null,
// };
// const text = ref(''); // 定义 text 的初始值
// const layout = ref('横排版'); // 定义 layout 的初始值
// const imgSize = ref('128'); // 定义 imgSize 的初始值
// 添加图片文字的方法
const addTextImages = async () => {
  cancelDraw();
  Spin.show();
  // 获取字体id数据
  const fontIdList = JSON.parse(sessionStorage.getItem('fontIdList')) || [];
  if (fontIdList.length > 0) {
    // 如果 fontIdList 已经存在，直接使用
    console.log('从会话存储中获取 fontIdList 数据:', fontIdList);
  } else {
    // 如果 fontIdList 不存在，重新获取
    console.log('会话存储中没有 fontIdList 数据，重新获取');
    try {
      const response = await axios.get(`${baseUrl}/imgfonts`);
      // console.log('获取 modelList 数据成功:', response.data);
      if (!response || !response.data || !response.data.data) {
        console.error('获取 fontIdList 数据失败:', response);
        Spin.hide(); // 隐藏加载动画
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

  const postData = {
    chars: '红军不怕远征难',
    layout: 0,
    img_size: 128,
    font_id: fontIdList[0].id,
    color: 'rgba(0,0,0,1)',
    stroke: {
      color: 'rgba(0,0,0,0)', // 边框颜色
      width: 0,
      type: '',
    },
  };
  console.log('调用接口获取图片文字数据参数:', postData);

  // 调用接口获取数据
  let response;
  try {
    response = await axios.post(`${baseUrl}/imgfont/glyphs`, postData);
  } catch (error) {
    console.error('接口请求失败:', error);
    Spin.hide(); // 隐藏加载动画
    return; // 如果接口请求失败，直接退出
  }
  console.log('接口返回的数据:', response);

  // 验证接口返回的数据
  if (!response || !response.data || !response.data.data) {
    console.error('接口返回的数据无效:', response);
    Spin.hide(); // 隐藏加载动画
    return; // 如果数据无效，直接退出
  }
  const textImagesJson = response.data.data;
  const { char_glyph_dict, chars, layout_data } = textImagesJson;
  const imageObjects = []; // 存储每个图片文字对象
  // 根据 chars 动态生成布局数据
  const filteredLayoutData = chars.split('').map((char, index) => {
    const layout = layout_data[index]; // 按 chars 的顺序取 layout_data
    return {
      char,
      x_offset: layout?.x_offset || index * 115.2, // 如果 layout_data 中没有对应数据，动态计算 x_offset
      y_offset: layout?.y_offset || 0, // 如果 layout_data 中没有对应数据，默认 y_offset 为 0
      z_index: layout?.z_index || index, // 如果 layout_data 中没有对应数据，按顺序设置 z_index
    };
  });

  filteredLayoutData.forEach((layout) => {
    const charData = char_glyph_dict[layout.char];
    if (!charData) return;

    const imgElement = new Image();
    imgElement.src = charData.img;

    imgElement.onload = () => {
      fabric.Image.fromURL(imgElement.src, (img) => {
        img.set({
          id: charData.id,
          fontId: fontIdList[0].id, // 字体ID
          name: charData.char,
          left: layout.x_offset, // 使用动态生成的 x_offset
          top: layout.y_offset, // 使用动态生成的 y_offset
          scaleX: 1, // 缩放比例
          scaleY: 1, // 缩放比例
          extensionType: 'fontImage', // 扩展类型
        });
        // 确保属性已正确设置
        // console.log('Image properties:', img);
        imageObjects.push(img);

        // 当所有图片加载完成后，创建组
        if (imageObjects.length === filteredLayoutData.length) {
          // 按 z_index 排序
          imageObjects.sort((a, b) => a.z_index - b.z_index);

          const group = new fabric.Group(imageObjects, {
            left: 100, // 整体初始位置
            top: 100,
            selectable: true, // 组可以被选中
            subTargetCheck: false, // 禁止选中组内子对象
          });
          // // 为组添加自定义属性;
          group.set({
            sentence: chars, // 图片文字组成的句子
            imgSize: 128, // 图片大小
            layout: 0, // 布局方式
            fontId: fontIdList[0].id, // 字体ID
            color: 'rgba(0,0,0,1)', // 文字颜色
            extensionType: 'textImage', // 添加 extensionType 属性
            stroke: {
              color: 'rgba(0,0,0,0)', // 边框颜色
              width: 0, // 边框宽度
              type: '', // 边框类型
            },
          });
          // 添加到画布
          console.log('group', group);

          canvasEditor.addBaseType(group, { center: false });
          Spin.hide(); // 隐藏加载动画
        }
      });
    };
  });
};
// 退出绘制状态
const cancelDraw = () => {
  if (!state.isDrawingLineMode) return;
  state.isDrawingLineMode = false;
  state.lineType = '';
  canvasEditor.setMode(false);
  endConflictTools();
  ensureObjectSelEvStatus(true, true);
};

onDeactivated(() => {
  cancelDraw();
});
</script>

<style scoped lang="less">
.tool-box {
  display: flex;
  justify-content: space-around;
  span {
    flex: 1;
    text-align: center;
    padding: 5px 0;
    background: #f6f6f6;
    margin-left: 2px;
    cursor: pointer;
    &:hover {
      background: #edf9ff;
      svg {
        fill: #2d8cf0;
      }
    }
  }
  .bg {
    background: #d8d8d8;

    &:hover {
      svg {
        fill: #2d8cf0;
      }
    }
  }
}
.box {
  margin-left: 2px;
  display: flex;
  flex-direction: column;
  background: #f6f6f6;
  gap: 5px;
  .list {
    display: grid;
    margin-left: 2px;
    grid-template-columns: 1fr 3fr;
    text-align: center;

    gap: 5px;
    align-items: center;
    justify-content: center;
  }
}

.img {
  width: 20px;
}
</style>
