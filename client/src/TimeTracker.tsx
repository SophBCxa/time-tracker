import { Button, Container, Nav, Tab } from 'react-bootstrap';
import { useMsal } from '@azure/msal-react';
import { ActivityForm } from './components/activities/ActivityForm';
import { ActivityList } from './components/activities/ActivityList';
import { ProjectList } from './components/projects/ProjectList';
import { ProjectRecap } from './components/recap/ProjectRecap';
import { DateRangeFilter } from './components/ui/DateRangeFilter';
import { OverflowWarningModal } from './components/ui/OverflowWarningModal';
import { useActivities } from './hooks/useActivities';
import { useProjects } from './hooks/useProjects';
import { useAuthInterceptor } from './hooks/useAuthInterceptor';
import { useDarkMode } from './hooks/useDarkMode';
import { useDateRange } from './hooks/useDateRange';
import { useOverflowWarning } from './hooks/useOverflowWarning';

type LocalUser = { name: string; isLocal: boolean };

type Props = {
  localUser:      LocalUser | null;
  onLocalLogout:  () => void;
};

export default function TimeTracker({ localUser, onLocalLogout }: Props) {
  const { instance, accounts } = useMsal();
  const msalUser = accounts[0];
  useAuthInterceptor();

  const { darkMode, toggleDarkMode } = useDarkMode();
  const { from, to, setFrom, setTo, setToday, setWeek, setMonth } = useDateRange();
  const { activities, totalTime, add, update, remove, duplicate } = useActivities(from, to);
  const { projects, types, addProject, updateProject, deleteProject, addType, deleteType } = useProjects();
  const { pending, handleAdd, confirm, cancel } = useOverflowWarning(activities, add);

  const displayName = msalUser?.name ?? msalUser?.username ?? localUser?.name;

  const handleLogout = () => {
    if (msalUser) {
      instance.logoutRedirect({ postLogoutRedirectUri: window.location.origin });
    } else {
      onLocalLogout();
    }
  };

  return (
    <div className="bg-body py-4" style={{ minHeight: '100vh' }}>
      <Container fluid="lg">

        {/* En-tête : dark mode | titre | utilisateur */}
        <div className="mb-4 d-flex justify-content-between">
          <div>
            <Button
              variant={darkMode ? 'outline-warning' : 'outline-secondary'}
              size="sm"
              onClick={toggleDarkMode}
              title={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
            >
              {darkMode ? '☀️ Clair' : '🌙 Sombre'}
            </Button>
          </div>

          <h1 className="fw-bold text-primary mb-0 text-center">Suivi d'activité</h1>

          <div className="d-flex align-items-center justify-content-end gap-2">
            {displayName && (
              <>
                <span className="text-muted small text-truncate" style={{ maxWidth: 140 }} title={displayName}>
                  <i className="fas fa-user-circle me-1" />
                  {displayName}
                </span>
                <Button variant="outline-secondary" size="sm" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </>
            )}
          </div>
        </div>

        <Tab.Container defaultActiveKey="activites">
          <DateRangeFilter
            from={from} to={to}
            onFromChange={setFrom} onToChange={setTo}
            onSetToday={setToday} onSetWeek={setWeek} onSetMonth={setMonth}
          />
          <Nav variant="tabs" className="mb-3">
            <Nav.Item><Nav.Link eventKey="activites">Mes activités</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="recap">Récap par projet</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="projets">Mes Projets</Nav.Link></Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="activites">
              <ActivityForm defaultDate={from} projects={projects} onSubmit={handleAdd} />
              <ActivityList
                activities={activities} totalTime={totalTime} defaultDate={from}
                projects={projects} onUpdate={update} onDelete={remove} onDuplicate={duplicate}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="recap">
              <ProjectRecap projects={projects} activities={activities} />
            </Tab.Pane>
            <Tab.Pane eventKey="projets">
              <ProjectList
                projects={projects} types={types}
                onAdd={addProject} onUpdate={updateProject} onDelete={deleteProject}
                onAddType={addType} onDeleteType={deleteType}
              />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>

      </Container>

      <OverflowWarningModal pending={pending} activities={activities} onConfirm={confirm} onCancel={cancel} />
    </div>
  );
}
