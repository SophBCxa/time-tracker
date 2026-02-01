import React from 'react';
import { Card, Badge, Button, ListGroup } from 'react-bootstrap';
import { mapColorToBootstrap } from '../utils/formatters';
import { getIcon } from '../utils/icons';

function ActivityCodeList({ activityCodes, onDelete, onEdit }) {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-warning text-dark">
        <h5 className="mb-0">Codes d'Activité Existants ({activityCodes.length})</h5>
      </Card.Header>
      <Card.Body>
        {activityCodes.length === 0 ? (
          <p className="text-center text-muted">Aucun code d'activité</p>
        ) : (
          <ListGroup variant="flush">
            {activityCodes.map((code) => (
              <ListGroup.Item
                key={code._id}
                className="d-flex align-items-center justify-content-between py-2"
              >
                <div className="d-flex align-items-center gap-2">
                  <Badge bg={mapColorToBootstrap(code.color)} className="py-1 px-2">
                    {code.icon && <span className="me-1">{getIcon(code.icon, 'sm')}</span>}
                    <span style={{ fontSize: '0.85rem' }}>{code.label}</span>
                  </Badge>
                  <small className="text-muted">{code.client}</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  {onEdit && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onEdit(code)}
                      title="Modifier ce code"
                    >
                      ✏️
                    </Button>
                  )}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDelete(code._id)}
                    title="Supprimer ce code"
                  >
                    🗑️
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
}

export default ActivityCodeList;
