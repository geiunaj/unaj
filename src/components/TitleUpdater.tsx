// components/TitleUpdater.tsx
import {useEffect} from 'react';
import usePageTitle from "@/lib/stores/titleStore.store";

const TitleUpdater: React.FC = () => {
    const title = usePageTitle((state) => state.title);

    useEffect(() => {
        document.title = title || 'App';
    }, [title]);

    return null;
};

export default TitleUpdater;


export const ChangeTitle = (title: string) => {
    const setTitle = usePageTitle((state) => state.setTitle);
    useEffect(() => {
        setTitle(title);
    }, [setTitle, title]);
    const setTitleHeader = usePageTitle((state) => state.setTitleHeader);
    useEffect(() => {
        setTitleHeader(title);
    }, [setTitleHeader, title]);
}