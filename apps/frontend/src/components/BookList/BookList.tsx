import React from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import type { Book } from '../../types/book';

export interface BookListProps {
  books: Book[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onDelete: (id: string) => void;
}

export const BookList: React.FC<BookListProps> = ({
  books,
  searchTerm,
  onSearchChange,
  onDelete
}) => {
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <Card.Header>Liste des livres</Card.Header>
      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Control 
            type="text" 
            placeholder="Rechercher un livre ou un auteur..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Form.Group>
        
        <div className="book-list" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {filteredBooks.length === 0 ? (
            <p className="text-muted text-center my-4">Aucun livre trouvé</p>
          ) : (
            filteredBooks.map(book => (
              <Card key={book.id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5>{book.title}</h5>
                      <p className="mb-1 text-muted">Par {book.author}</p>
                      <p className="mb-1">
                        <span className="badge bg-secondary me-2">{book.category}</span>
                        <span className="badge bg-info">Stock: {book.stock}</span>
                      </p>
                      <p className="mb-0">{book.summary}</p>
                    </div>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => onDelete(book.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default BookList;
