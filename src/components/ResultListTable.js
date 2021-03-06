import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import { GenderFemale, GenderMale } from 'react-bootstrap-icons';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';
import { EVENT_TYPE_BIRTH, EVENT_TYPE_DEATH } from '../api';
import { RANGE_ABOUT, RANGE_AFTER, RANGE_BEFORE, RANGE_BETWEEN, RANGE_EXACT } from '../form/DateRangeGroup';
import { normalizeTextToken, selectElementText, tokenizeAndNormalizeText, tokenizeText } from '../utils';

export function ResultListTable({ results, formData, disabled, withHighlights, withLinks, columnEventType, columnActCode }) {
  const intl = useIntl();
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

    const surnameNeedles = tokenizeAndNormalizeText(formData.surname || '');
    const givenNameNeedles = tokenizeAndNormalizeText(formData.givenName || '');
    const HighlightFuzzy = ({ text, needles }) => {
      if(text && withHighlights) {
        const parts = tokenizeText(text);
        return parts.map((token, i) => (
          <React.Fragment key={i}>
            {i % 2 === 0 ?
              (needles.includes(normalizeTextToken(token)) ? <strong onClick={handleChildClick}>{token}</strong> : token) :
              token}
          </React.Fragment>
        ));
      } else {
        return text || null;
      }
    };
    const HighlightSuffix = ({ text, suffix }) => {
      if(text && withHighlights && suffix != null && text.endsWith(suffix)) {
        return (
          <>
            {text.substring(0, text.length - suffix.length)}
            <strong onClick={handleChildClick}>{text.substring(text.length - suffix.length)}</strong>
          </>
        );
      } else {
        return text || null;
      }
    };
    const HighlightConditional = ({ children, isHighlighted }) => withHighlights && isHighlighted ? (
      <strong onClick={handleChildClick}>{children}</strong>
    ) : children;
    const LinkWhenAvailable = ({ children, urls }) => {
      if(urls && withLinks) {
        const url = urls[intl.locale] || urls['fr'] || urls['en']; // This should be the expected behavior
        return url ? (
          <a href={url} target="_blank" rel="noreferrer" className="table-row-link">
            {children}
          </a>
        ) : children;
      } else {
        return children;
      }
    };
    const placeText = formData.place.length > 0 ? formData.place[0].fullname : null;
    const hasYearFilter =
      formData.rangeType === RANGE_BETWEEN && (formData.yearAfter !== undefined || formData.yearBefore !== undefined) ||
      ((formData.rangeType === RANGE_AFTER || formData.rangeType === RANGE_BEFORE || formData.rangeType === RANGE_EXACT || formData.rangeType === RANGE_ABOUT) && formData.year !== undefined);
    return (
      <tbody key={index}>
        <tr>
          <td rowSpan={2} className="text-center">
            <span title={intl.formatMessage({ id: entry.gender ? 'result.gender.male' : 'result.gender.female' })}>
              <GenderCmp className={`icon icon-gender ${genderColor}`} />
            </span>
          </td>
          <TextTd rowSpan={2}>
            <LinkWhenAvailable urls={entry.wikipedia}>
              <HighlightFuzzy text={entry.nom} needles={surnameNeedles} />
            </LinkWhenAvailable>
          </TextTd>
          <TextTd rowSpan={2}>
            <LinkWhenAvailable urls={entry.wikipedia}>
              <HighlightFuzzy text={entry.prenom} needles={givenNameNeedles} />
            </LinkWhenAvailable>
          </TextTd>
          {columnEventType && (
            <td><FormattedMessage id="common.event.birth" /></td>
          )}
          <TextTd>
            <HighlightConditional isHighlighted={formData.sortBy === EVENT_TYPE_BIRTH && hasYearFilter}>
              {entry.birthDate ? (
                <time dateTime={entry.birthDate}><FormattedDate value={entry.birthDate} timeZone="UTC" /></time>
              ) : null}
            </HighlightConditional>
          </TextTd>
          <TextTd><HighlightSuffix text={entry.birthPlace} suffix={placeText} /></TextTd>
          {columnActCode && (
            <td rowSpan={2} className="text-center">
              {!!entry.actCode && (
                <FormattedMessage id="common.numbering" values={{ number: entry.actCode }} />
              )}
            </td>
          )}
        </tr>
        <tr>
          {columnEventType && (
            <td><FormattedMessage id="common.event.death" /></td>
          )}
          <TextTd><HighlightConditional isHighlighted={formData.sortBy === EVENT_TYPE_DEATH && hasYearFilter}>
              {entry.deathDate ? (
                <time dateTime={entry.deathDate}><FormattedDate value={entry.deathDate} timeZone="UTC" /></time>
              ) : null}
            </HighlightConditional></TextTd>
          <TextTd><HighlightSuffix text={entry.deathPlace} suffix={placeText} /></TextTd>
        </tr>
      </tbody>
    );
  };

  return (
    <Table responsive className={`result-table ${disabled ? 'group-disabled' : ''}`}>
      <thead>
      <tr>
        <th><FormattedMessage id="result.header.gender" /></th>
        <th><FormattedMessage id="result.header.surnames" /></th>
        <th><FormattedMessage id="result.header.given_names" /></th>
        {columnEventType && (
          <th><FormattedMessage id="result.header.event" /></th>
        )}
        <th><FormattedMessage id="result.header.date" /></th>
        <th><FormattedMessage id="result.header.place" /></th>
        {columnActCode && (
          <th><FormattedMessage id="result.header.act_code" /></th>
        )}
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
  withLinks: PropTypes.bool,
  columnEventType: PropTypes.bool,
  columnActCode: PropTypes.bool,
};

ResultListTable.defaultProps = {
  disabled: false,
  withHighlights: false,
  withLinks: false,
  columnEventType: false,
  columnActCode: false,
};
