import { useState, useCallback } from "react";
import { bookService } from "../services/bookService";
import type { Book, BookFormData } from "../types/book";

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchBooks = useCallback(async () => {
    try {
      const data = await bookService.getAll();
      setBooks(data);
      setError("");
    } catch (error) {
      setError("Erreur lors du chargement des livres");
      console.error(
        "Erreur:",
        error instanceof Error ? error.message : "Erreur inconnue"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const addBook = useCallback(
    async (bookData: BookFormData) => {
      try {
        await bookService.create(bookData);
        await fetchBooks();
        return true;
      } catch (error) {
        setError("Erreur lors de l'ajout du livre");
        console.error(
          "Erreur:",
          error instanceof Error ? error.message : "Erreur inconnue"
        );
        return false;
      }
    },
    [fetchBooks]
  );

  const deleteBook = useCallback(
    async (id: string) => {
      try {
        await bookService.delete(id);
        await fetchBooks();
        return true;
      } catch (error) {
        setError("Erreur lors de la suppression du livre");
        console.error(
          "Erreur:",
          error instanceof Error ? error.message : "Erreur inconnue"
        );
        return false;
      }
    },
    [fetchBooks]
  );

  return {
    books,
    loading,
    error,
    fetchBooks,
    addBook,
    deleteBook,
  };
};
