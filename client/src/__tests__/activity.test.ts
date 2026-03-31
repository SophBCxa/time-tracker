import { createActivity } from '../domain/Activity';
import { ActivityStore } from '../store/ActivityStore';

// -- Test 1 : export CSV ------------------------------------------------------

describe('ActivityStore.exportCSV', () => {
  it('genere le header correct', () => {
    expect(ActivityStore.exportCSV([], [])).toBe('Date;TempsPass\u00e9;Projet;Code NISA;Type;D\u00e9tail');
  });

  it('genere une ligne avec virgule decimale pour Excel', () => {
    const a = createActivity({
      date: '2026-03-26',
      timeSpent: 0.5,
      project: 'PARCEO2025',
      type: 'Atelier',
      detail: 'Kick-off',
    });
    const csv = ActivityStore.exportCSV([a], []);
    expect(csv).toContain('2026-03-26;0,5;PARCEO2025;;Atelier;"Kick-off"');
  });

  it('echappe les guillemets dans le detail', () => {
    const a = createActivity({
      date: '2026-03-26',
      timeSpent: 0.25,
      project: 'MAINTENANCE',
      type: 'Support',
      detail: 'Fix "urgent"',
    });
    expect(ActivityStore.exportCSV([a], [])).toContain('"Fix ""urgent"""');
  });

  it('inclut le Code NISA du projet quand il est fourni', () => {
    const a = createActivity({ date: '2026-03-26', timeSpent: 0.5, project: 'PARCEO2025', type: 'Atelier', detail: '' });
    const projects = [{ id: '1', name: 'PARCEO2025', nisaCode: 'NIS-42', color: '#000', allowedTypes: [] }];
    const csv = ActivityStore.exportCSV([a], projects);
    expect(csv).toContain('NIS-42');
  });
});

// -- Test 2 : CRUD localStorage -----------------------------------------------

describe('ActivityStore CRUD', () => {
  beforeEach(() => localStorage.clear());

  it('add + getByDate retourne l activite ajoutee', () => {
    const a = createActivity({
      date: '2026-03-26',
      timeSpent: 0.5,
      project: 'MAINTENANCE',
      type: 'Correction',
      detail: '',
    });
    ActivityStore.add(a);
    const results = ActivityStore.getByDate('2026-03-26');
    expect(results).toHaveLength(1);
    expect(results[0].timeSpent).toBe(0.5);
  });

  it('getByDate ne retourne pas les activites d un autre jour', () => {
    const a = createActivity({
      date: '2026-03-26',
      timeSpent: 1,
      project: 'MAINTENANCE',
      type: 'Correction',
      detail: '',
    });
    ActivityStore.add(a);
    expect(ActivityStore.getByDate('2026-03-27')).toHaveLength(0);
  });

  it('update modifie le bon enregistrement', () => {
    const a = createActivity({
      date: '2026-03-26',
      timeSpent: 0.5,
      project: 'MAINTENANCE',
      type: 'Correction',
      detail: '',
    });
    ActivityStore.add(a);
    ActivityStore.update({ ...a, detail: 'modifie' });
    expect(ActivityStore.getByDate('2026-03-26')[0].detail).toBe('modifie');
  });

  it('delete supprime uniquement la bonne entree', () => {
    const a = createActivity({ date: '2026-03-26', timeSpent: 0.5, project: 'MAINTENANCE', type: 'Correction', detail: '' });
    const b = createActivity({ date: '2026-03-26', timeSpent: 0.5, project: 'PARCEO2025', type: 'Atelier', detail: '' });
    ActivityStore.add(a);
    ActivityStore.add(b);
    ActivityStore.delete(a.id);
    const results = ActivityStore.getByDate('2026-03-26');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(b.id);
  });

  it('getByDateRange retourne les activites sur plusieurs jours', () => {
    const a = createActivity({ date: '2026-03-25', timeSpent: 1, project: 'MAINTENANCE', type: 'Correction', detail: '' });
    const b = createActivity({ date: '2026-03-26', timeSpent: 0.5, project: 'PARCEO2025', type: 'Atelier', detail: '' });
    ActivityStore.add(a);
    ActivityStore.add(b);
    expect(ActivityStore.getByDateRange('2026-03-25', '2026-03-26')).toHaveLength(2);
    expect(ActivityStore.getByDateRange('2026-03-26', '2026-03-26')).toHaveLength(1);
  });
});
