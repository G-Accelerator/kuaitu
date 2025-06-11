import axios from 'axios';
const baseUrl = import.meta.env.APP_MYAPIHOST;
// 获取图片文字组的字形数据
export const fetchTextImageData = (postData: {
  font_id: string;
  chars: string;
  img_size: number;
  layout: number;
  color: string;
  stroke: {
    color: string;
    width: number;
    type: string;
  };
}) => {
  return axios.post(`${baseUrl}/imgfont/glyphs`, postData);
};
// 获取字体类型ID数据
export const fetchFontIdList = () => {
  return axios.get(`${baseUrl}/imgfonts`);
};
// 获取备选字形列表
export const fetchFontList = (params: { font_id: string; chars: string; img_size: number }) => {
  return axios.get(`${baseUrl}/imgfont/glyph/nchoices`, { params });
};
// 提交选择的字形
export const postFontChoice = (data: { font_id: string; char: string; glyph_id: string }) => {
  return axios.post(`${baseUrl}/imgfont/glyph/choice`, data);
};
// 保存快照
export const postSnapshot = (data: {
  temp_id: number;
  img_base64: string;
  json_config: string;
}) => {
  return axios.post(`${baseUrl}/snapshot/save`, data);
};
// 获取最近的快照列表
export const fetchSnapshotList = (params: { page_size: number; page_index: number }) => {
  return axios.get(`${baseUrl}/snapshot/history`, { params });
};
