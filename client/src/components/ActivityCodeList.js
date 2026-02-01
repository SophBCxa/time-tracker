import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { mapColorToBootstrap } from '../utils/formatters';

function ActivityCodeList({ activityCodes, onDelete }) {
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
                  e.currentTarget.querySelector('.delete-btn').style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector('.delete-btn').style.opacity = '0';
                }}
              >
                <Badge
                  bg={mapColorToBootstrap(code.color)}
                  className="p-3"
                  style={{ fontSize: '1rem', cursor: 'default' }}
                >
                  {code.label} - {code.client}
                </Badge>
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
