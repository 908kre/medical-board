export const mocks = Array.from({ length: 10 }).map((_, i) => {
  return {
    id: i + 1,
    name: `Item ${i + 1}`,
  }
});
