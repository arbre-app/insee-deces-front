import PropTypes from 'prop-types';
import { stringifyUrl } from 'query-string';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import {
  DEFAULT_EVENT_TYPE,
  DEFAULT_ORDER_TYPE,
  EVENT_TYPE_BIRTH,
  EVENT_TYPE_DEATH,
  ORDER_TYPE_ASCENDING,
  ORDER_TYPE_DESCENDING,
} from '../api';
import { API_ENDPOINT } from '../config';
import { ApiMethodDocumentation } from './ApiMethodDocumentation';
import { BackButton } from './BackButton';

export function BlockApi({ onBackClick }) {
  const typeString = <FormattedMessage id="api.parameter_value.string" />;
  const typeIntegerPositive = <FormattedMessage id="api.parameter_value.positive_integer" />;
  const typeIntegerBetween = (min, max) => (
    <FormattedMessage id="api.parameter_value.integer_between" values={{ min: <code>{min}</code>, max: <code>{max}</code> }} />
  );
  const typeOr = (left, right) => (
    <FormattedMessage id="api.parameter_value.either" values={{ left: <code>{left}</code>, right: <code>{right}</code> }} />
  );
  const typeYear = <FormattedMessage id="api.parameter_value.year" />;
  const typeBirthOrDeath = typeOr(EVENT_TYPE_BIRTH, EVENT_TYPE_DEATH);
  const typeAscendingOrDescending = typeOr(ORDER_TYPE_ASCENDING, ORDER_TYPE_DESCENDING);

  return (
    <div className="block">
      <BackButton onClick={onBackClick} />
      <div className="my-2">
        <h3><FormattedMessage id="api.title" /></h3>
        <p className="text-justify">
          <FormattedMessage id="api.description" />
        </p>
        <h4><FormattedMessage id="api.technical_details.title" /></h4>
        <p className="text-justify">
          <FormattedMessage id="api.technical_details.description.entrypoint" values={{ i: entrypointEnglish => <em>{entrypointEnglish}</em>, entrypoint: <kbd>{API_ENDPOINT}</kbd> }} />
        </p>
        <p className="text-justify">
          <FormattedMessage id="api.technical_details.url.wikipedia_json">
            {url => (
              <FormattedMessage id="api.technical_details.description.json" values={{ a: json => <a href={url} target="_blank" rel="noreferrer">{json}</a> }} />
            )}
          </FormattedMessage>
        </p>
        <p className="text-justify">
          <FormattedMessage id="api.technical_details.description.authentication" />
        </p>
        <h4><FormattedMessage id="api.quota.title" /></h4>
        <p className="text-justify">
          <FormattedMessage id="api.quota.description" values={{ limit: <strong><FormattedNumber value={3600} /></strong>, useragent: <code>User-Agent</code> }} />
        </p>
        <h4><FormattedMessage id="api.documentation.title" /></h4>
        <h5><FormattedMessage id="api.documentation.person_search.title" /></h5>
        <ApiMethodDocumentation
          method="/persons"
          type="GET"
          description={<FormattedMessage id="api.documentation.person_search.description" />}
          exampleUrl={stringifyUrl({
            url: `${API_ENDPOINT}/persons`,
            query: {
              surname: 'chirac',
              name: 'jacques rene',
            },
          }, {
            sort: false,
          })}
          exampleResult={{
            code: 200,
            count: 1,
            results: [
              {
                actCode: '129',
                birthDate: '1932-11-29',
                birthPlace: 'Paris 5e Arrondissement, Paris, Île-de-France, France',
                deathDate: '2019-09-26',
                deathPlace: 'Paris 6e Arrondissement, Paris, Île-de-France, France',
                gender: true,
                nom: 'CHIRAC',
                prenom: 'Jacques René',
                wikipedia: {
                  fr: 'https://fr.wikipedia.org/wiki/Jacques_Chirac',
                  en: 'https://en.wikipedia.org/wiki/Jacques_Chirac'
                },
              }
            ],
          }}
        >
          <ApiMethodDocumentation.Parameter
            parameter="surname"
            description={<FormattedMessage id="api.parameter_type.surname" />}
            type={typeString}
            isRequired
          />
          <ApiMethodDocumentation.Parameter
            parameter="name"
            description={<FormattedMessage id="api.parameter_type.given_name" />}
            type={typeString}
          />
          <ApiMethodDocumentation.Parameter
            parameter="place"
            description={<FormattedMessage id="api.parameter_type.place_id" />}
            type={typeIntegerPositive}
          />
          <ApiMethodDocumentation.Parameter
            parameter="event"
            description={<FormattedMessage id="api.parameter_type.event_type" />}
            type={typeBirthOrDeath}
            defaultValue={DEFAULT_EVENT_TYPE}
          />
          <ApiMethodDocumentation.Parameter
            parameter="after"
            description={<FormattedMessage id="api.parameter_type.year_after" />}
            type={typeYear}
          />
          <ApiMethodDocumentation.Parameter
            parameter="before"
            description={<FormattedMessage id="api.parameter_type.year_before" />}
            type={typeYear}
          />
          <ApiMethodDocumentation.Parameter
            parameter="order"
            description={<FormattedMessage id="api.parameter_type.sort_order" />}
            type={typeAscendingOrDescending}
            defaultValue={DEFAULT_ORDER_TYPE}
          />
          <ApiMethodDocumentation.Parameter
            parameter="offset"
            description={<FormattedMessage id="api.parameter_type.window_offset" />}
            type={typeIntegerPositive}
            defaultValue={0}
          />
          <ApiMethodDocumentation.Parameter
            parameter="limit"
            description={<FormattedMessage id="api.parameter_type.window_limit" />}
            type={typeIntegerBetween(0, 100)}
            defaultValue={10}
          />
        </ApiMethodDocumentation>
        <h5><FormattedMessage id="api.documentation.place_search.title" /></h5>
        <ApiMethodDocumentation
          method="/places"
          type="GET"
          description={<FormattedMessage id="api.documentation.place_search.description" />}
          exampleUrl={stringifyUrl({
            url: `${API_ENDPOINT}/places`,
            query: {
              prefix: 'paris',
              limit: 3,
            },
          }, {
            sort: false,
          })}
          exampleResult={{
            code: 200,
            results: [
              {
                fullname: 'Paris, Île-de-France, France',
                id: 99
              },
              {
                fullname: 'Paris 14e Arrondissement, Paris, Île-de-France, France',
                id: 108
              },
              {
                fullname: 'Paris 15e Arrondissement, Paris, Île-de-France, France',
                id: 103
              }
            ],
          }}
        >
          <ApiMethodDocumentation.Parameter
            parameter="prefix"
            description={<FormattedMessage id="api.parameter_type.query" />}
            type={typeString}
            isRequired
          />
          <ApiMethodDocumentation.Parameter
            parameter="limit"
            description={<FormattedMessage id="api.parameter_type.window_limit" />}
            type={typeIntegerBetween(0, 25)}
            defaultValue={10}
          />
        </ApiMethodDocumentation>
        <h5><FormattedMessage id="api.documentation.statistics_geography.title" /></h5>
        <ApiMethodDocumentation
          method="/stats/geography"
          type="GET"
          description={<FormattedMessage id="api.documentation.statistics_geography.description" />}
          exampleUrl={stringifyUrl({
            url: `${API_ENDPOINT}/stats/geography`,
            query: {
              surname: 'chirac',
              name: 'jacques',
            },
          }, {
            sort: false,
          })}
          exampleResult={{
            code: 200,
            results: [
              {
                count: 1,
                name: 'D-75'
              },
              {
                count: 1,
                name: 'D-19'
              },
              {
                count: 1,
                name: 'D-63'
              }
            ],
          }}
        >
          <ApiMethodDocumentation.Parameter
            parameter="surname"
            description={<FormattedMessage id="api.parameter_type.surname" />}
            type={typeString}
            isRequired
          />
          <ApiMethodDocumentation.Parameter
            parameter="name"
            description={<FormattedMessage id="api.parameter_type.given_name" />}
            type={typeString}
          />
        </ApiMethodDocumentation>
        <h5><FormattedMessage id="api.documentation.statistics_year.title" /></h5>
        <ApiMethodDocumentation
          method="/stats/time"
          type="GET"
          description={<FormattedMessage id="api.documentation.statistics_year.description" />}
          exampleUrl={stringifyUrl({
            url: `${API_ENDPOINT}/stats/time`,
            query: {
              surname: 'chirac',
              name: 'jacques',
              event: EVENT_TYPE_BIRTH,
            },
          }, {
            sort: false,
          })}
          exampleResult={{
            code: 200,
            results: [
              {
                count: 1,
                name: '1926'
              },
              {
                count: 1,
                name: '1932'
              }
            ],
          }}
        >
          <ApiMethodDocumentation.Parameter
            parameter="surname"
            description={<FormattedMessage id="api.parameter_type.surname" />}
            type={typeString}
            isRequired
          />
          <ApiMethodDocumentation.Parameter
            parameter="name"
            description={<FormattedMessage id="api.parameter_type.given_name" />}
            type={typeString}
          />
          <ApiMethodDocumentation.Parameter
            parameter="place"
            description={<FormattedMessage id="api.parameter_type.place_id" />}
            type={typeIntegerPositive}
          />
          <ApiMethodDocumentation.Parameter
            parameter="event"
            description={<FormattedMessage id="api.parameter_type.event_type" />}
            type={typeBirthOrDeath}
            defaultValue={EVENT_TYPE_BIRTH}
          />
        </ApiMethodDocumentation>
      </div>
      <BackButton onClick={onBackClick} />
    </div>
  );
}

BlockApi.propTypes = {
  onBackClick: PropTypes.func.isRequired,
};
