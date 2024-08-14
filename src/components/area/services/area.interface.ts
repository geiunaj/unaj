export interface Area {
    id: number;
    nombre: string;
}

export interface AreaRequest {
    nombre: string;
}

export interface CreateAreaProps {
    onClose: () => void;
}

export interface UpdateAreaProps {
    id: number;
    onClose: () => void;
}