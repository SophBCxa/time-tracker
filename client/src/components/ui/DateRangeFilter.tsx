import { Row, Col, Form, Button } from 'react-bootstrap';

type Props = {
  from:         string;
  to:           string;
  onFromChange: (v: string) => void;
  onToChange:   (v: string) => void;
  onSetToday:   () => void;
  onSetWeek:    () => void;
  onSetMonth:   () => void;
};

export function DateRangeFilter({ from, to, onFromChange, onToChange, onSetToday, onSetWeek, onSetMonth }: Props) {
  return (
    <Row className="align-items-end g-2 mb-3 justify-content-center">
      <Col xs="auto">
        <Form.Label className="mb-1 small fw-semibold">Du</Form.Label>
        <Form.Control type="date" value={from} onChange={(e) => onFromChange(e.target.value)} style={{ width: 'auto' }} />
      </Col>
      <Col xs="auto">
        <Form.Label className="mb-1 small fw-semibold">Au</Form.Label>
        <Form.Control type="date" value={to} min={from} onChange={(e) => onToChange(e.target.value)} style={{ width: 'auto' }} />
      </Col>
      <Col xs="auto" className="pb-1">
        <Button variant="outline-secondary" size="sm" onClick={onSetToday}>Aujourd'hui</Button>
        {' '}
        <Button variant="outline-secondary" size="sm" onClick={onSetWeek}>Cette semaine</Button>
        {' '}
        <Button variant="outline-secondary" size="sm" onClick={onSetMonth}>Ce mois-ci</Button>
      </Col>
    </Row>
  );
}
