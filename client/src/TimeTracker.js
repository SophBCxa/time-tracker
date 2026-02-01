import React, { useState } from 'react';
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
    updateActivityCode,
  } = useActivityCodesData();

  const [editingCodeId, setEditingCodeId] = useState(null);

  const handleActivityCodeSubmit = async (payload) => {
    if (editingCodeId) {
      const ok = await updateActivityCode(editingCodeId, payload);
      if (ok) setEditingCodeId(null);
      return ok;
    }
    return createActivityCode(payload);
  };

  const {
    newCode,
    setNewCode,
    errors: activityCodeFormErrors,
    isSubmitting: isActivityCodeSubmitting,
    handleSubmit: handleNewCodeSubmit,
    resetForm: resetActivityCodeForm,
  } = useActivityCodeForm({ onSubmit: handleActivityCodeSubmit });

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

  const startEditCode = (code) => {
    setEditingCodeId(code._id);
    setNewCode({
      label: code.label || '',
      color: code.color || '',
      client: code.client || '',
      icon: code.icon || '',
    });
  };

  const cancelEditCode = () => {
    setEditingCodeId(null);
    resetActivityCodeForm();
  };

  return (
    <div className="bg-light py-5">
      <Container fluid className="px-0">

        {error && <Alert variant="danger" onClose={clearError} dismissible>{error}</Alert>}
        {success && <Alert variant="success" onClose={clearSuccess} dismissible>{success}</Alert>}

        {isLoading && (
          <div className="d-flex justify-content-center my-4">
            <Spinner animation="border" role="status" aria-label="Chargement" />
          </div>
        )}

        <Tab.Container defaultActiveKey="entries">
          <Row className="g-4">
            <Col lg={2} md={3} className="ps-0">
              <div className="px-3">
                <h6 className="text-uppercase text-muted fw-bold mb-3">Menu</h6>
              </div>
              <Nav variant="pills" className="flex-column">
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
            </Col>
            <Col lg={10} md={9}>
              <h1 className="mb-4 fw-bold text-primary">⏱️ Time Tracker</h1>
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
                  <div className="px-3">
                    <Row className="g-5">
                    <Col lg={4}>
                      <ActivityCodeList
                        activityCodes={activityCodes}
                        onDelete={deleteActivityCode}
                        onEdit={startEditCode}
                      />
                    </Col>
                    <Col lg={8}>
                      <ActivityCodeForm
                        newCode={newCode}
                        setNewCode={setNewCode}
                        errors={activityCodeFormErrors}
                        isSubmitting={isActivityCodeSubmitting}
                        onSubmit={handleNewCodeSubmit}
                        isEditing={!!editingCodeId}
                        onCancelEdit={cancelEditCode}
                      />
                    </Col>
                    </Row>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
}

export default TimeTracker;