import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import { GenderFemale, GenderMale } from '../icons';

export function ResultListTable({ results }) {
  const renderRow = (entry, index) => {
    const GenderCmp = entry.gender ? GenderMale : GenderFemale;
    const genderColor = entry.gender ? 'color-male' : 'color-female';
    return (
      <tbody key={index}>
        <tr>
          <td rowSpan={2} className="text-center"><GenderCmp className={`icon ${genderColor}`} /></td>
          <td rowSpan={2}>{entry.surname}</td>
          <td rowSpan={2}>{entry.name}</td>
          <td>Naissance</td>
          <td>{entry.birthDate}</td>
          <td>{entry.birthPlace}</td>
        </tr>
        <tr>
          <td>Décès</td>
          <td>{entry.deathDate}</td>
          <td>{entry.deathPlace}</td>
        </tr>
      </tbody>
    );
  };

  return (
    <Table responsive className="result-table">
      <thead>
      <tr>
        <th>Sexe</th>
        <th>Noms</th>
        <th>Prénoms</th>
        <th>Événement</th>
        <th>Date</th>
        <th>Lieu</th>
      </tr>
      </thead>
      {results.map(renderRow)}
    </Table>
  );
}

ResultListTable.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape({
    birthDate: PropTypes.string,
    birthPlace: PropTypes.string,
    deathDate: PropTypes.string,
    deathPlace: PropTypes.string,
    gender: PropTypes.bool.isRequired,
    nom: PropTypes.string,
    prenom: PropTypes.string,
  })).isRequired,
};

ResultListTable.defaultProps = {};