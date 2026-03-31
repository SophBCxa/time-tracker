import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActivityForm } from '../components/activities/ActivityForm';
import { createProject } from '../domain/Project';

const projectA = createProject({
  name: 'Projet A',
  nisaCode: '',
  color: '#0d6efd',
  allowedTypes: ['Correction', 'Atelier'],
});

const projectB = createProject({
  name: 'Projet B',
  nisaCode: '',
  color: '#198754',
  allowedTypes: ['Support'],
});

const mockProjects = [projectA, projectB];

function getTypeSelect() {
  // L'option vide "— Aucun —" est uniquement dans le select Type
  return screen.getByRole('option', { name: '— Aucun —' }).closest('select') as HTMLSelectElement;
}

function getProjectSelect() {
  return screen.getAllByRole('combobox')[1] as HTMLSelectElement;
}

describe('ActivityForm — champ Type', () => {
  it('affiche toujours l option vide "— Aucun —"', () => {
    render(<ActivityForm defaultDate="2026-03-31" projects={mockProjects} onSubmit={jest.fn()} />);
    expect(screen.getByRole('option', { name: '— Aucun —' })).toBeInTheDocument();
  });

  it('liste les types du projet selectionne', () => {
    render(<ActivityForm defaultDate="2026-03-31" projects={mockProjects} onSubmit={jest.fn()} />);
    expect(screen.getByRole('option', { name: 'Correction' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Atelier' })).toBeInTheDocument();
  });

  it('le bouton Ajouter est actif meme sans type selectionne', () => {
    render(<ActivityForm defaultDate="2026-03-31" projects={mockProjects} onSubmit={jest.fn()} />);
    const typeSelect = getTypeSelect();
    fireEvent.change(typeSelect, { target: { value: '' } });
    expect(screen.getByRole('button', { name: /ajouter/i })).not.toBeDisabled();
  });

  it('soumet avec type vide quand aucun type selectionne', () => {
    const onSubmit = jest.fn();
    render(<ActivityForm defaultDate="2026-03-31" projects={mockProjects} onSubmit={onSubmit} />);
    const typeSelect = getTypeSelect();
    fireEvent.change(typeSelect, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /ajouter/i }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ type: '' }));
  });

  it('reinitialise le type si le type selectionne n existe pas dans le nouveau projet', () => {
    render(<ActivityForm defaultDate="2026-03-31" projects={mockProjects} onSubmit={jest.fn()} />);
    const typeSelect = getTypeSelect();
    // Sélectionner "Atelier" (disponible dans Projet A)
    fireEvent.change(typeSelect, { target: { value: 'Atelier' } });
    expect(typeSelect.value).toBe('Atelier');

    // Changer de projet vers Projet B (qui n'a que "Support")
    const projectSelect = getProjectSelect();
    fireEvent.change(projectSelect, { target: { value: 'Projet B' } });

    // Le type "Atelier" n'existe pas dans Projet B → doit être réinitialisé à ''
    expect(typeSelect.value).toBe('');
  });

  it('conserve le type si il existe dans le nouveau projet', () => {
    const projectC = createProject({
      name: 'Projet C',
      nisaCode: '',
      color: '#dc3545',
      allowedTypes: ['Correction', 'Support'],
    });
    render(<ActivityForm defaultDate="2026-03-31" projects={[projectA, projectC]} onSubmit={jest.fn()} />);
    const typeSelect = getTypeSelect();
    // Sélectionner "Correction" (disponible dans les deux projets)
    fireEvent.change(typeSelect, { target: { value: 'Correction' } });
    const projectSelect = getProjectSelect();
    fireEvent.change(projectSelect, { target: { value: 'Projet C' } });
    // "Correction" existe aussi dans Projet C → doit être conservé
    expect(typeSelect.value).toBe('Correction');
  });
});
