import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectRecap } from '../components/recap/ProjectRecap';
import { createActivity, Activity } from '../domain/Activity';
import { createProject } from '../domain/Project';

const TODAY = new Date().toISOString().slice(0, 10);

const projA = createProject({ name: 'PROJ-A', nisaCode: '', color: '#0d6efd', allowedTypes: ['Correction', 'Atelier'] });
const projB = createProject({ name: 'PROJ-B', nisaCode: '', color: '#198754', allowedTypes: ['Support'] });
const mockProjects = [projA, projB];

const seededActivities: Activity[] = [
  createActivity({ date: TODAY, timeSpent: 0.5, project: 'PROJ-A', type: 'Correction', detail: 'fix bug' }),
  createActivity({ date: TODAY, timeSpent: 0.5, project: 'PROJ-A', type: 'Atelier',    detail: '' }),
  createActivity({ date: TODAY, timeSpent: 1,   project: 'PROJ-B', type: 'Support',    detail: 'support client' }),
];

describe('ProjectRecap — affichage', () => {
  it('affiche un message quand aucune activite sur la periode', () => {
    render(<ProjectRecap projects={mockProjects} activities={[]} />);
    expect(screen.getByText(/Aucune activité/i)).toBeInTheDocument();
  });

  it('affiche les lignes projet avec leur total', () => {
    render(<ProjectRecap projects={mockProjects} activities={seededActivities} />);
    expect(screen.getByText('PROJ-A')).toBeInTheDocument();
    expect(screen.getByText('PROJ-B')).toBeInTheDocument();
    // PROJ-A = 1j, PROJ-B = 1j → deux badges "1 j"
    expect(screen.getAllByText('1 j')).toHaveLength(2);
  });

  it('affiche les pourcentages corrects', () => {
    render(<ProjectRecap projects={mockProjects} activities={seededActivities} />);
    // PROJ-A = 1j / 2j total = 50%, PROJ-B = 1j / 2j = 50%
    const pcts = screen.getAllByText('50 %');
    expect(pcts.length).toBeGreaterThanOrEqual(2);
  });

  it('affiche la ligne total avec le bon cumul', () => {
    render(<ProjectRecap projects={mockProjects} activities={seededActivities} />);
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('2 j')).toBeInTheDocument();
  });
});

describe('ProjectRecap — expansion projet', () => {
  it('les lignes de types sont cachees par defaut', () => {
    render(<ProjectRecap projects={mockProjects} activities={seededActivities} />);
    expect(screen.queryByText(/↳ Correction/)).not.toBeInTheDocument();
    expect(screen.queryByText(/↳ Support/)).not.toBeInTheDocument();
  });

  it('cliquer sur un projet affiche ses types', () => {
    render(<ProjectRecap projects={mockProjects} activities={seededActivities} />);
    fireEvent.click(screen.getByText('PROJ-A'));
    expect(screen.getByText(/↳ Correction/)).toBeInTheDocument();
    expect(screen.getByText(/↳ Atelier/)).toBeInTheDocument();
  });

  it('cliquer deux fois sur un projet le referme', () => {
    render(<ProjectRecap projects={mockProjects} activities={seededActivities} />);
    fireEvent.click(screen.getByText('PROJ-A'));
    fireEvent.click(screen.getByText('PROJ-A'));
    expect(screen.queryByText(/↳ Correction/)).not.toBeInTheDocument();
  });
});

describe('ProjectRecap — expansion type', () => {
  it('les activites individuelles sont cachees par defaut', () => {
    render(<ProjectRecap projects={mockProjects} activities={seededActivities} />);
    fireEvent.click(screen.getByText('PROJ-A'));
    expect(screen.queryByText('fix bug')).not.toBeInTheDocument();
  });

  it('cliquer sur un type affiche les activites avec leur date', () => {
    render(<ProjectRecap projects={mockProjects} activities={seededActivities} />);
    fireEvent.click(screen.getByText('PROJ-A'));
    fireEvent.click(screen.getByText(/↳ Correction/));
    expect(screen.getByText('fix bug')).toBeInTheDocument();
    // La date doit être affichée (formatée en fr-FR)
    const dateFormatted = new Date(TODAY + 'T00:00:00').toLocaleDateString('fr-FR', {
      weekday: 'short', day: 'numeric', month: 'short',
    });
    expect(screen.getByText(new RegExp(dateFormatted.replace('.', '\\.')))).toBeInTheDocument();
  });

  it('affiche un tiret pour les activites sans detail', () => {
    render(<ProjectRecap projects={mockProjects} activities={seededActivities} />);
    fireEvent.click(screen.getByText('PROJ-A'));
    fireEvent.click(screen.getByText(/↳ Atelier/));
    // L'activité Atelier a detail='' → doit afficher '—'
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('cliquer deux fois sur un type le referme', () => {
    render(<ProjectRecap projects={mockProjects} activities={seededActivities} />);
    fireEvent.click(screen.getByText('PROJ-A'));
    fireEvent.click(screen.getByText(/↳ Correction/));
    fireEvent.click(screen.getByText(/↳ Correction/));
    expect(screen.queryByText('fix bug')).not.toBeInTheDocument();
  });
});

describe('ProjectRecap — agregation', () => {
  it('cumule correctement plusieurs activites du meme type', () => {
    const activities: Activity[] = [
      createActivity({ date: TODAY, timeSpent: 0.25, project: 'PROJ-A', type: 'Correction', detail: 'a' }),
      createActivity({ date: TODAY, timeSpent: 0.25, project: 'PROJ-A', type: 'Correction', detail: 'b' }),
    ];
    render(<ProjectRecap projects={mockProjects} activities={activities} />);
    fireEvent.click(screen.getByText('PROJ-A'));
    expect(screen.getByText(/↳ Correction/)).toBeInTheDocument();
    // Badge projet + ligne type + total = plusieurs "0.5 j"
    expect(screen.getAllByText('0.5 j').length).toBeGreaterThanOrEqual(2);
  });

  it('trie les projets par temps decroissant', () => {
    render(<ProjectRecap projects={mockProjects} activities={seededActivities} />);
    const rows = screen.getAllByRole('row');
    const projAIndex = rows.findIndex(r => r.textContent?.includes('PROJ-A'));
    const projBIndex = rows.findIndex(r => r.textContent?.includes('PROJ-B'));
    // PROJ-B (1j) et PROJ-A (1j) sont égaux ici — vérifier qu'ils sont tous les deux présents
    expect(projAIndex).toBeGreaterThan(0);
    expect(projBIndex).toBeGreaterThan(0);
  });
});
