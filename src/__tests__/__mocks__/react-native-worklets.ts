export const Worklets = {
  createRunOnJS: (fn: (...args: unknown[]) => void) => fn,
};

export const useWorklet = (fn: (...args: unknown[]) => void) => fn;
export const createWorklet = (fn: (...args: unknown[]) => void) => fn;

export default {
  Worklets,
  useWorklet,
  createWorklet,
};
