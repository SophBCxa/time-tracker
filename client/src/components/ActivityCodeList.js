import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
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
          <div className="d-flex flex-wrap gap-3">
            {activityCodes.map((code) => (
              <div
                key={code._id}
                className="position-relative"
                style={{
                  display: 'inline-block',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  const deleteBtn = e.currentTarget.querySelector('.delete-btn');
                  const editBtn = e.currentTarget.querySelector('.edit-btn');
                  if (deleteBtn) deleteBtn.style.opacity = '1';
                  if (editBtn) editBtn.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  const deleteBtn = e.currentTarget.querySelector('.delete-btn');
                  const editBtn = e.currentTarget.querySelector('.edit-btn');
                  if (deleteBtn) deleteBtn.style.opacity = '0';
                  if (editBtn) editBtn.style.opacity = '0';
                }}
              >
                <Badge
                  bg={mapColorToBootstrap(code.color)}
                  className="p-3"
                  style={{ fontSize: '1rem', cursor: 'default' }}
                >
                  {code.icon && <span className="me-2">{getIcon(code.icon, 'sm')}</span>}
                  {code.label} - {code.client}
                </Badge>
                {onEdit && (
                  <Button
                    variant="link"
                    className="edit-btn"
                    onClick={() => onEdit(code)}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '26px',
                      padding: '0',
                      opacity: '0',
                      transition: 'opacity 0.2s',
                      background: '#0d6efd',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: 'white',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                    title="Modifier ce code"
                  >
                    ✏️
                  </Button>
                )}
                <Button
                  variant="link"
                  className="delete-btn"
                  onClick={() => onDelete(code._id)}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    padding: '0',
                    opacity: '0',
                    transition: 'opacity 0.2s',
                    background: '#dc3545',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    color: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                  title="Supprimer ce code"
                >
                  🗑️
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default ActivityCodeList;
