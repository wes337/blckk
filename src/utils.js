export const randomNumberBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const isLive = () => {
  return Date.now() >= Date.UTC(2026, 2, 4, 19, 0, 0);
};
