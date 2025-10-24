import React from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import type { BookFormData } from '../../types/book';

export interface BookFormProps {
  formData: BookFormData;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const BookForm: React.FC<BookFormProps> = ({ formData, onSubmit, onInputChange }) => (
  <Card>
    <Card.Header>Ajouter un livre</Card.Header>
    <Card.Body>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Titre</Form.Label>
          <Form.Control 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={onInputChange} 
            required 
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Auteur</Form.Label>
          <Form.Control 
            type="text" 
            name="author" 
            value={formData.author} 
            onChange={onInputChange} 
            required 
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Catégorie</Form.Label>
          <Form.Select 
            name="category" 
            value={formData.category} 
            onChange={onInputChange}
            required
          >
            <option value="">Sélectionner une catégorie</option>
            <option value="FICTION">Fiction</option>
            <option value="NON_FICTION">Non-fiction</option>
            <option value="SCIENCE_FICTION">Science-fiction</option>
            <option value="FANTASY">Fantasy</option>
            <option value="BIOGRAPHY">Biographie</option>
            <option value="HISTORY">Histoire</option>
            <option value="SELF_HELP">Développement personnel</option>
            <option value="OTHER">Autre</option>
          </Form.Select>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Résumé</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={3} 
            name="summary" 
            value={formData.summary} 
            onChange={onInputChange} 
            required 
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Stock</Form.Label>
          <Form.Control 
            type="number" 
            name="stock" 
            value={formData.stock || ''} 
            onChange={onInputChange} 
            min="0"
            required 
          />
        </Form.Group>
        
        <Button variant="primary" type="submit">
          Ajouter le livre
        </Button>
      </Form>
    </Card.Body>
  </Card>
);

export default BookForm;
