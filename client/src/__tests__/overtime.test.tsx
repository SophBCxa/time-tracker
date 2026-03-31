import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import TimeTracker from '../TimeTracker';
import { ActivityStore } from '../store/ActivityStore';
import { createActivity, Activity } from '../domain/Activity';
import { createProject } from '../domain/Project';
import { ActivityApi } from '../services/activityApi';
import { ProjectApi } from '../services/projectApi';

jest.mock('../services/activityApi');
jest.mock('../services/projectApi');

jest.mock('@azure/msal-browser', () => ({
  PublicClientApplication: jest.fn().mockImplementation(() => ({})),
  InteractionRequiredAuthError: class extends Error {},
}));

jest.mock('@azure/msal-react', () => ({
  MsalProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useMsal: () => ({
    instance: { logoutRedirect: jest.fn(), loginRedirect: jest.fn() },
    accounts: [{ name: 'Test User', username: 'test@test.com' }],
  }),
}));

jest.mock('../hooks/useAuthInterceptor', () => ({
  useAuthInterceptor: () => {},
}));

const TODAY = new Date().toISOString().slice(0, 10);

describe('Alerte dépassement journalier — logique', () => {
  beforeEach(() => localStorage.clear());

  it('detecte quand l ajout depasse 1 journee', () => {
    ActivityStore.add(createActivity({ date: TODAY, timeSpent: 0.75, project: 'P', type: '', detail: '' }));
    const dayTotal = ActivityStore.getByDate(TODAY).reduce((sum, a) => sum + a.timeSpent, 0);
    expect(dayTotal + 0.5).toBeGreaterThan(1);
  });

  it('ne declenche pas d alerte si le total est exactement 1', () => {
    ActivityStore.add(createActivity({ date: TODAY, timeSpent: 0.5, project: 'P', type: '', detail: '' }));
    const dayTotal = ActivityStore.getByDate(TODAY).reduce((sum, a) => sum + a.timeSpent, 0);
    expect(dayTotal + 0.5).toBe(1);
    expect(dayTotal + 0.5 > 1).toBe(false);
  });

  it('ne declenche pas d alerte si le jour est vide', () => {
    const dayTotal = ActivityStore.getByDate(TODAY).reduce((sum, a) => sum + a.timeSpent, 0);
    expect(dayTotal + 1 > 1).toBe(false);
  });
});

async function getAddButton() {
  const buttons = await screen.findAllByRole('button', { name: /ajouter/i });
  return buttons.find((btn) => !btn.hasAttribute('disabled')) as HTMLElement;
}

describe('Alerte dépassement journalier — interface', () => {
  let preSeeded: Activity[];

  beforeEach(() => {
    jest.clearAllMocks();
    preSeeded = [
      createActivity({ date: TODAY, timeSpent: 0.75, project: 'PARCEO2025', type: '', detail: '' }),
    ];

    (ActivityApi.getByRange as jest.Mock).mockImplementation(() =>
      Promise.resolve([...preSeeded])
    );
    (ActivityApi.add as jest.Mock).mockImplementation(async (a: Activity) => {
      preSeeded = [...preSeeded, a];
      (ActivityApi.getByRange as jest.Mock).mockImplementation(() =>
        Promise.resolve([...preSeeded])
      );
      return a;
    });
    (ActivityApi.update as jest.Mock).mockResolvedValue(undefined);
    (ActivityApi.delete as jest.Mock).mockResolvedValue(undefined);

    const mockProject = createProject({ name: 'PARCEO2025', nisaCode: '', color: '#0d6efd', allowedTypes: [] });
    (ProjectApi.getAll as jest.Mock).mockResolvedValue([mockProject]);
    (ProjectApi.getTypes as jest.Mock).mockResolvedValue([]);
    (ProjectApi.add as jest.Mock).mockResolvedValue(mockProject);
    (ProjectApi.update as jest.Mock).mockResolvedValue(mockProject);
    (ProjectApi.delete as jest.Mock).mockResolvedValue(undefined);
    (ProjectApi.addType as jest.Mock).mockResolvedValue(undefined);
    (ProjectApi.deleteType as jest.Mock).mockResolvedValue(undefined);
  });

  it('affiche le modal quand le total du jour depasserait 1', async () => {
    await act(async () => {
      render(<TimeTracker localUser={null} onLocalLogout={jest.fn()} />);
    });

    // Le formulaire a déjà 0.5j par défaut → 0.75 + 0.5 = 1.25 > 1
    const submitBtn = await getAddButton();
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/D\u00e9passement de journ\u00e9e/i)).toBeInTheDocument();
    });
  });

  it('enregistre l activite si on confirme', async () => {
    await act(async () => {
      render(<TimeTracker localUser={null} onLocalLogout={jest.fn()} />);
    });

    const submitBtn = await getAddButton();
    fireEvent.click(submitBtn);

    await waitFor(() => screen.getByText(/D\u00e9passement de journ\u00e9e/i));

    fireEvent.click(screen.getByRole('button', { name: /Enregistrer quand m\u00eame/i }));

    // Le modal doit disparaître et l'activité doit être enregistrée
    await waitFor(() => {
      expect(screen.queryByText(/D\u00e9passement de journ\u00e9e/i)).not.toBeInTheDocument();
    });
    expect(ActivityApi.add).toHaveBeenCalledTimes(1);
  });

  it('n enregistre pas l activite si on annule', async () => {
    await act(async () => {
      render(<TimeTracker localUser={null} onLocalLogout={jest.fn()} />);
    });

    const submitBtn = await getAddButton();
    fireEvent.click(submitBtn);

    await waitFor(() => screen.getByText(/D\u00e9passement de journ\u00e9e/i));

    fireEvent.click(screen.getByRole('button', { name: /Annuler/i }));

    await waitFor(() => {
      expect(screen.queryByText(/D\u00e9passement de journ\u00e9e/i)).not.toBeInTheDocument();
    });
    // L'activité ne doit pas avoir été enregistrée
    expect(ActivityApi.add).not.toHaveBeenCalled();
  });
});
