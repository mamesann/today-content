import { computed } from 'vue';

export const today = computed(() => {
  return {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  };
});
export default {
  today
};
