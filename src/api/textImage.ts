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
