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
