import { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { BookForm } from "./components/BookForm";
import { BookList } from "./components/BookList";
import { useBooks } from "./hooks/useBooks";
import type { BookFormData } from "./types/book";

function App() {
  const { books, loading, error, addBook, deleteBook, fetchBooks } = useBooks();
  
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);
  
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    category: "FICTION",
    summary: "",
    stock: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stock" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addBook(formData);
    if (success) {
      setFormData({
        title: "",
        author: "",
        category: "FICTION",
        summary: "",
        stock: 0,
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) {
      await deleteBook(id);
    }
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Gestion de la bibliothèque</h1>

      {loading && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={6}>
          <BookForm
            formData={formData}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
          />
        </Col>

        <Col md={6}>
          <BookList
            books={books}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onDelete={handleDelete}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
