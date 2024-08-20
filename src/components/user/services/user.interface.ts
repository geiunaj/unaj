export interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  type_user_id: number;
  type_user: TypeUser;
}

export interface UserCollectionItem {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  type_user: string
}

export interface UserRequest {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  type_user: string;
}

export interface CreateUserProps {
  onClose: () => void;
}

export interface UpdateUserProps {
  id: number;
  onClose: () => void;
}

export interface TypeUser {
  id: number;
  type_name: string;
}



export interface UserCollection {
  data: UserCollectionItem[];
  meta: Meta;
}


export interface Meta {
  page: number;
  perPage: number;
  totalRecords: number;
  totalPages: number;
}