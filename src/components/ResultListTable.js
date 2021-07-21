import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import { FormattedDate } from 'react-intl';
import { EVENT_TYPE_BIRTH, EVENT_TYPE_DEATH } from '../api';
import { RANGE_ABOUT, RANGE_AFTER, RANGE_BEFORE, RANGE_BETWEEN, RANGE_EXACT } from '../form/DateRangeGroup';
import { GenderFemale, GenderMale } from '../icons';
import { selectElementText } from '../utils';

export function ResultListTable({ results, formData, disabled, withHighlights }) {
  const renderRow = (entry, index) => {
    const GenderCmp = entry.gender ? GenderMale : GenderFemale;
    const genderColor = entry.gender ? 'color-male' : 'color-female';
    const TextTd = ({ children, ...other }) => (
      <td {...other} onClick={e => {
        if (e.detail === 2) { // Double click
          const target = e.target;
          selectElementText(target);
        }
      }}>
        {children}
      </td>
    );
    const handleChildClick = e => {
      if (e.detail === 2) {
        const target = e.target;
        selectElementText(target.parentElement);
        e.stopPropagation();
      }
    };
    const removeAccents = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const tokenizeText = text => {
      const r = /([^a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+)/g;
      return text.split(r);
    };
    const normalizeTextToken = token => {
      return removeAccents(token).toLowerCase();
    };
    const tokenizeAndNormalizeText = text => tokenizeText(text).filter((_, i) => i % 2 === 0).map(normalizeTextToken).filter(s => s);
    const surnameNeedles = tokenizeAndNormalizeText(formData.surname || '');
    const givenNameNeedles = tokenizeAndNormalizeText(formData.givenName || '');
    const HighlightFuzzy = ({ text, needles }) => {
      if(withHighlights) {
        const parts = tokenizeText(text);
        return parts.map((token, i) => (
          <React.Fragment key={i}>
            {i % 2 === 0 ?
              (needles.includes(normalizeTextToken(token)) ? <strong onClick={handleChildClick}>{token}</strong> : token) :
              token}
          </React.Fragment>
        ));
      } else {
        return text;
      }
    };
    const HighlightSuffix = ({ text, suffix }) => {
      if(withHighlights && suffix != null && text.endsWith(suffix)) {
        return (
          <>
            {text.substring(0, text.length - suffix.length)}
            <strong onClick={handleChildClick}>{text.substring(text.length - suffix.length)}</strong>
          </>
        );
      } else {
        return text;
      }
    };
    const HighlightConditional = ({ children, isHighlighted }) => withHighlights && isHighlighted ? (
      <strong onClick={handleChildClick}>{children}</strong>
    ) : children;
    const placeText = formData.place.length > 0 ? formData.place[0].fullname : null;
    const hasYearFilter =
      formData.rangeType === RANGE_BETWEEN && (formData.yearAfter !== undefined || formData.yearBefore !== undefined) ||
      ((formData.rangeType === RANGE_AFTER || formData.rangeType === RANGE_BEFORE || formData.rangeType === RANGE_EXACT || formData.rangeType === RANGE_ABOUT) && formData.year !== undefined);
    return (
      <tbody key={index}>
        <tr>
          <td rowSpan={2} className="text-center"><GenderCmp className={`icon icon-gender ${genderColor}`} /></td>
          <TextTd rowSpan={2}><HighlightFuzzy text={entry.nom} needles={surnameNeedles} /></TextTd>
          <TextTd rowSpan={2}><HighlightFuzzy text={entry.prenom} needles={givenNameNeedles} /></TextTd>
          <td>Naissance</td>
          <TextTd><HighlightConditional isHighlighted={formData.sortBy === EVENT_TYPE_BIRTH && hasYearFilter}><FormattedDate value={entry.birthDate} /></HighlightConditional></TextTd>
          <TextTd><HighlightSuffix text={entry.birthPlace} suffix={placeText} /></TextTd>
        </tr>
        <tr>
          <td>Décès</td>
          <TextTd><HighlightConditional isHighlighted={formData.sortBy === EVENT_TYPE_DEATH && hasYearFilter}><FormattedDate value={entry.deathDate} /></HighlightConditional></TextTd>
          <TextTd><HighlightSuffix text={entry.deathPlace} suffix={placeText} /></TextTd>
        </tr>
      </tbody>
    );
  };

  return (
    <Table responsive className={`result-table ${disabled ? 'group-disabled' : ''}`}>
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
  formData: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  withHighlights: PropTypes.bool,
};

ResultListTable.defaultProps = {
  disabled: false,
  withHighlights: false,
};
