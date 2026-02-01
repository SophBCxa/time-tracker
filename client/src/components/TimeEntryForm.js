import React from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';

function TimeEntryForm({ 
  date, 
  setDate, 
  activityCode, 
  setActivityCode, 
  timeSpent, 
  setTimeSpent, 
  details, 
  setDetails,
  activityCodes,
  errors,
  isSubmitting,
  onSubmit 
}) {
  return (
    <Row className="justify-content-center">
      <Col lg="6">
        <Card className="shadow-sm">
          <Card.Header className="bg-success text-white">
            <h5 className="mb-0">Enregistrer une Nouvelle Entrée</h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={onSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  isInvalid={!!errors?.date}
                />
                <Form.Control.Feedback type="invalid">
                  {errors?.date}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Code d'Activité</Form.Label>
                <Form.Select
                  value={activityCode}
                  onChange={(e) => setActivityCode(e.target.value)}
                  required
                  isInvalid={!!errors?.activityCode}
                >
                  <option value="">-- Sélectionner un code --</option>
                  {activityCodes.map((code) => (
                    <option key={code._id} value={code._id}>
                      {code.label} ({code.client})
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors?.activityCode}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Temps passé (minutes)</Form.Label>
                <Form.Control
                  type="number"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(e.target.value)}
                  placeholder="ex: 120"
                  min="1"
                  required
                  isInvalid={!!errors?.timeSpent}
                />
                <Form.Control.Feedback type="invalid">
                  {errors?.timeSpent}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Détails (optionnel)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="ex: Réunion client, Débogage bug, etc."
                  isInvalid={!!errors?.details}
                />
                <Form.Control.Feedback type="invalid">
                  {errors?.details}
                </Form.Control.Feedback>
              </Form.Group>

              <Button variant="success" type="submit" className="w-100 fw-bold" disabled={isSubmitting}>
                {isSubmitting ? 'Enregistrement...' : '✅ Enregistrer'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default TimeEntryForm;
