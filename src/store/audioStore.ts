import create from 'zustand';

// 1. Define the interface for the store's state
interface AudioStoreState {
  audioUrl: string | null;
  setAudioUrl: (url: string | null) => void;
}

// 2. Create the Zustand store with the defined interface
const useAudioStore = create<AudioStoreState>((set) => ({
  audioUrl: null,
  setAudioUrl: (url) => set({ audioUrl: url }),
}));

export default useAudioStore;
