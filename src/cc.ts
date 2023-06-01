export type CC = 'left' | 'right';

export const toggleCC = (curr: CC) => curr === 'left' ? 'right' : 'left';

// 計算量改善の余地あり
export const toggleCCTimes = (curr: CC, times: number): CC =>
  times < 0 ? toggleCCTimes(curr, -times)
            : times === 0 ? curr : toggleCCTimes(toggleCC(curr), times - 1);
