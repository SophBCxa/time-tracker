import { Modal, Button } from 'react-bootstrap';
import { Activity } from '../../domain/Activity';

type NewActivity = Omit<Activity, 'id'>;

type Props = {
  pending:    NewActivity | null;
  activities: Activity[];
  onConfirm:  () => void;
  onCancel:   () => void;
};

export function OverflowWarningModal({ pending, activities, onConfirm, onCancel }: Props) {
  if (!pending) return null;

  const dayTotal = activities
    .filter(a => a.date === pending.date)
    .reduce((sum, a) => sum + a.timeSpent, 0);
  const newTotal = dayTotal + pending.timeSpent;

  return (
    <Modal show onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>⚠️ Dépassement de journée</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Le total des imputations du <strong>{pending.date}</strong> atteindrait{' '}
          <strong>{newTotal.toLocaleString('fr-FR')} jour{newTotal > 1 ? 's' : ''}</strong>{' '}
          (actuellement {dayTotal.toLocaleString('fr-FR')}).
          <br /><br />
          Voulez-vous quand même enregistrer cette imputation ?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>Annuler</Button>
        <Button variant="warning" onClick={onConfirm}>Enregistrer quand même</Button>
      </Modal.Footer>
    </Modal>
  );
}
