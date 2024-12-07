export interface Sedes {
    id: number;
    name: string;
}

export interface SedesRequest {
    name: string;
}

export interface CreateSedesProps {
    onClose: () => void;
}

export interface UpdateSedesProps {
    id: number;
    onClose: () => void;
}
