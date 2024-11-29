export interface Area {
  id: number;
  nombre: string;
  sede: string;
}

export interface AreaRequest {
  nombre: string;
  sedeId: number;
}

export interface CreateAreaProps {
  onClose: () => void;
}

export interface UpdateAreaProps {
  id: number;
  onClose: () => void;
}
