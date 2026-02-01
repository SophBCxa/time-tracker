import React, { useMemo, useState } from 'react';
import { Card, Button, Table, Badge, Spinner } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { formatDate, formatTime, formatTimeDaysValue, mapColorToBootstrap } from '../utils/formatters';
import { getIcon } from '../utils/icons';

function TimeEntryList({ entries, onDelete, onUpdateSaisie, updatingIds }) {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const sortedEntries = useMemo(() => {
    const data = [...entries];
    const { key, direction } = sortConfig;
    data.sort((a, b) => {
      let aValue = '';
      let bValue = '';

      if (key === 'date') {
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
      } else if (key === 'activity') {
        aValue = (a.activityCode?.label || '').toLowerCase();
        bValue = (b.activityCode?.label || '').toLowerCase();
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [entries, sortConfig]);

  const toggleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };
  const exportToExcel = () => {
    const rows = entries.map((entry) => ({
      Date: formatDate(entry.date),
      Activite: entry.activityCode?.label || 'N/A',
      Client: entry.activityCode?.client || '',
      Jours: formatTimeDaysValue(entry.timeSpent),
      Details: entry.details || '',
      NISA: entry.saisie?.nisa ? 'Oui' : 'Non',
      Perso: entry.saisie?.perso ? 'Oui' : 'Non',
      Equipes: entry.saisie?.equipes ? 'Oui' : 'Non',
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Entries');
    XLSX.writeFile(workbook, 'time_entries.xlsx');
  };

  return (
    <div className="mx-auto" style={{ maxWidth: '80%' }}>
      <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Historique des Entrées ({entries.length})</h5>
          <Button variant="light" size="sm" onClick={exportToExcel}>
            📥 Exporter Excel
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {entries.length === 0 ? (
          <p className="text-center text-muted">Aucune entrée pour le moment</p>
        ) : (
          <div className="table-responsive">
            <Table hover striped>
              <thead className="table-light">
                <tr>
                  <th rowSpan={2} style={{ cursor: 'pointer' }} onClick={() => toggleSort('date')}>
                    Date{getSortIndicator('date')}
                  </th>
                  <th rowSpan={2} style={{ cursor: 'pointer' }} onClick={() => toggleSort('activity')}>
                    Activité{getSortIndicator('activity')}
                  </th>
                  <th rowSpan={2} className="text-end">Durée (jours)</th>
                  <th colSpan={3} className="text-center">Saisie</th>
                  <th rowSpan={2} className="text-center">Actions</th>
                </tr>
                <tr>
                  <th className="text-center">NISA</th>
                  <th className="text-center">Perso</th>
                  <th className="text-center">Equipes</th>
                </tr>
              </thead>
              <tbody>
                {sortedEntries.map((entry) => {
                  const saisie = entry.saisie || {};
                  const isUpdating = !!updatingIds?.[entry._id];
                  const handleSaisieChange = (field, checked) => {
                    if (!onUpdateSaisie) return;
                    onUpdateSaisie(entry._id, {
                      saisie: {
                        nisa: !!saisie.nisa,
                        perso: !!saisie.perso,
                        equipes: !!saisie.equipes,
                        [field]: checked,
                      },
                    });
                  };

                  return (
                    <tr key={entry._id}>
                    <td>{formatDate(entry.date)}</td>
                    <td>
                      <div
                        title={entry.details || 'Aucun détail'}
                        style={{ cursor: entry.details ? 'help' : 'default' }}
                      >
                        <Badge bg={mapColorToBootstrap(entry.activityCode?.color)}>
                          {entry.activityCode?.icon && <span className="me-2">{getIcon(entry.activityCode.icon, 'sm')}</span>}
                          {entry.activityCode?.label || 'N/A'}
                        </Badge>
                        {entry.details && (
                          <small className="ms-2 text-muted">💬</small>
                        )}
                      </div>
                    </td>
                    <td className="text-end fw-bold">{formatTime(entry.timeSpent)}</td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        aria-label="Saisie NISA"
                        checked={!!saisie.nisa}
                        disabled={isUpdating}
                        onChange={(e) => handleSaisieChange('nisa', e.target.checked)}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        aria-label="Saisie Perso"
                        checked={!!saisie.perso}
                        disabled={isUpdating}
                        onChange={(e) => handleSaisieChange('perso', e.target.checked)}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        aria-label="Saisie Equipes"
                        checked={!!saisie.equipes}
                        disabled={isUpdating}
                        onChange={(e) => handleSaisieChange('equipes', e.target.checked)}
                      />
                    </td>
                    <td className="text-center">
                      {isUpdating && (
                        <span className="me-2 text-muted" title="Enregistrement en cours">
                          <Spinner animation="border" size="sm" />
                        </span>
                      )}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onDelete(entry._id)}
                        title="Supprimer cette entrée"
                      >
                        🗑️
                      </Button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
      </Card>
    </div>
  );
}

export default TimeEntryList;
