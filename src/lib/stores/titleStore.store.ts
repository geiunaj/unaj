// stores/usePageTitle.ts
import {create} from 'zustand';

interface PageTitleState {
    title: string;
    titleHeader: string;
    setTitle: (newTitle: string) => void;
    setTitleHeader: (newTitle: string) => void;
}

const usePageTitle = create<PageTitleState>((set) => ({
    title: '',
    titleHeader: '',
    setTitle: (newTitle) => set({title: newTitle}),
    setTitleHeader: (newTitle) => set({titleHeader: newTitle}),
}));

export default usePageTitle;
