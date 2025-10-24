export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  summary: string;
  stock: number;
  updatedAt?: string;
}

export interface BookFormData {
  title: string;
  author: string;
  category: string;
  summary: string;
  stock: number;
}
