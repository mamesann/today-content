import { ref } from 'vue';

// 共有ストア（簡易）
export const selectConstellation = ref(7);
export const CONSTELLATION = {
  0: '牡羊座',
  1: '牡牛座',
  2: '双子座',
  3: '蟹座',
  4: '獅子座',
  5: '乙女座',
  6: '天秤座',
  7: '蠍座',
  8: '射手座',
  9: '山羊座',
  10: '水瓶座',
  11: '魚座'
};

export default {
  selectConstellation,
  CONSTELLATION,
};
