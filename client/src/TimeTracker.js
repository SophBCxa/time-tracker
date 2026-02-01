import React from 'react';
import { Container, Row, Col, Alert, Nav, Tab, Spinner } from 'react-bootstrap';
import TimeEntryList from './components/TimeEntryList';
import TimeEntryForm from './components/TimeEntryForm';
import ActivityCodeList from './components/ActivityCodeList';
import ActivityCodeForm from './components/ActivityCodeForm';
import { useActivityCodesData } from './hooks/useActivityCodesData';
import { useActivityCodeForm } from './hooks/useActivityCodeForm';
import { useTimeEntriesData } from './hooks/useTimeEntriesData';
import { useTimeEntryForm } from './hooks/useTimeEntryForm';

function TimeTracker() {
  const {
    activityCodes,
    error: activityCodesError,
    success: activityCodesSuccess,
    isLoading: isActivityCodesLoading,
    clearError: clearActivityCodesError,
    clearSuccess: clearActivityCodesSuccess,
    createActivityCode,
    deleteActivityCode,
  } = useActivityCodesData();

  const {
    newCode,
    setNewCode,
    errors: activityCodeFormErrors,
    isSubmitting: isActivityCodeSubmitting,
    handleSubmit: handleNewCodeSubmit,
  } = useActivityCodeForm({ onSubmit: createActivityCode });

  const {
    entries,
    error: timeEntriesError,
    success: timeEntriesSuccess,
    isLoading: isTimeEntriesLoading,
    updatingIds: timeEntriesUpdatingIds,
    clearError: clearTimeEntriesError,
    clearSuccess: clearTimeEntriesSuccess,
    createTimeEntry,
    deleteTimeEntry,
    updateTimeEntry,
  } = useTimeEntriesData();

  const {
    activityCode,
    setActivityCode,
    timeSpent,
    setTimeSpent,
    date,
    setDate,
    details,
    setDetails,
    errors: timeEntryFormErrors,
    isSubmitting: isTimeEntrySubmitting,
    handleSubmit,
  } = useTimeEntryForm({ onSubmit: createTimeEntry });

  const error = activityCodesError || timeEntriesError;
  const success = timeEntriesSuccess || activityCodesSuccess;
  const isLoading = isActivityCodesLoading || isTimeEntriesLoading;

  const clearError = () => {
    if (activityCodesError) clearActivityCodesError();
    if (timeEntriesError) clearTimeEntriesError();
  };

  const clearSuccess = () => {
    if (activityCodesSuccess) clearActivityCodesSuccess();
    if (timeEntriesSuccess) clearTimeEntriesSuccess();
  };

  return (
    <div className="bg-light py-5">
      <Container>
        <h1 className="mb-5 text-center fw-bold text-primary">⏱️ Time Tracker</h1>

        {error && <Alert variant="danger" onClose={clearError} dismissible>{error}</Alert>}
        {success && <Alert variant="success" onClose={clearSuccess} dismissible>{success}</Alert>}

        {isLoading && (
          <div className="d-flex justify-content-center my-4">
            <Spinner animation="border" role="status" aria-label="Chargement" />
          </div>
        )}

        <Tab.Container defaultActiveKey="entries">
          <Nav variant="pills" className="mb-4 justify-content-center">
            <Nav.Item>
              <Nav.Link eventKey="entries" className="btn-lg">📊 Entrées de Temps</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="new-entry" className="btn-lg">➕ Nouvelle Entrée</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="activities" className="btn-lg">🏷️ Codes d'Activité</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="entries">
              <TimeEntryList
                entries={entries}
                onDelete={deleteTimeEntry}
                onUpdateSaisie={updateTimeEntry}
                updatingIds={timeEntriesUpdatingIds}
              />
            </Tab.Pane>

            <Tab.Pane eventKey="new-entry">
              <TimeEntryForm
                date={date}
                setDate={setDate}
                activityCode={activityCode}
                setActivityCode={setActivityCode}
                timeSpent={timeSpent}
                setTimeSpent={setTimeSpent}
                details={details}
                setDetails={setDetails}
                activityCodes={activityCodes}
                errors={timeEntryFormErrors}
                isSubmitting={isTimeEntrySubmitting}
                onSubmit={handleSubmit}
              />
            </Tab.Pane>

            <Tab.Pane eventKey="activities">
              <Row className="g-4">
                <Col lg={6}>
                  <ActivityCodeList
                    activityCodes={activityCodes}
                    onDelete={deleteActivityCode}
                  />
                </Col>
                <Col lg={6}>
                  <ActivityCodeForm
                    newCode={newCode}
                    setNewCode={setNewCode}
                    errors={activityCodeFormErrors}
                    isSubmitting={isActivityCodeSubmitting}
                    onSubmit={handleNewCodeSubmit}
                  />
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </div>
  );
}

export default TimeTracker;