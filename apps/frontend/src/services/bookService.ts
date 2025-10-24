import axios from "axios";
import type { Book, BookFormData } from "../types/book";

const API_URL = import.meta.env.VITE_API_URL + "/books";

export const bookService = {
  async getAll(): Promise<Book[]> {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async getOne(id: string): Promise<Book> {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  async create(book: BookFormData): Promise<Book> {
    const response = await axios.post(API_URL, book);
    return response.data;
  },

  async update(id: string, book: BookFormData): Promise<Book> {
    const response = await axios.put(`${API_URL}/${id}`, book);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },
};

export default bookService;
