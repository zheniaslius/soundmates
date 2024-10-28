import create from 'zustand';

const useAudioStore = create((set) => ({
  audioUrl: null,
  setAudioUrl: (url) => set({ audioUrl: url }),
}));

export default useAudioStore;
