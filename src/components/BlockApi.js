import PropTypes from 'prop-types';
import { stringifyUrl } from 'query-string';
import { FormattedNumber } from 'react-intl';
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
  // All of this will be i18n'd with useIntl().formatMessage
  const typeString = 'Chaîne de caractères';
  const typeIntegerPositive = 'Entier positif';
  const typeIntegerBetween = (min, max) => (
    <>
      Entier de <code>{min}</code> à <code>{max}</code>
    </>
  );
  const typeOr = (left, right) => (
    <>
      <code>{left}</code> ou <code>{right}</code>
    </>
  );
  const typeYear = 'Année';
  const typeBirthOrDeath = typeOr(EVENT_TYPE_BIRTH, EVENT_TYPE_DEATH);
  const typeAscendingOrDescending = typeOr(ORDER_TYPE_ASCENDING, ORDER_TYPE_DESCENDING);

  return (
    <div className="block">
      <BackButton onClick={onBackClick} />
      <div className="my-2">
        <h3>Interface de programmation (API)</h3>
        <p>
          Le service peut également être utilisé au travers de son API, qui est décrite ici.
        </p>
        <h4>Détails techniques</h4>
        <p>
          Le point d'entrée de l'API (<em>endpoint</em>) est le suivant : <kbd>{API_ENDPOINT}</kbd>
        </p>
        <p>
          Les résultats sont retournés au format <a href="https://fr.wikipedia.org/wiki/JavaScript_Object_Notation" target="_blank" rel="noreferrer">JSON</a>.
        </p>
        <p>
          Il n'y a pas d'authentification.
        </p>
        <h4>Quota</h4>
        <p>
          Il vous est cordialement demandé de rester (vous, ou votre application) en dessous des <strong><FormattedNumber value={3600} /></strong> requêtes par heure.
          Vous pouvez accessoirement utiliser le champ <code>User-Agent</code> pour spécifier un point de contact en cas de problème.
        </p>
        <h4>Documentation de l'API</h4>
        <h5>Recherche de fiches</h5>
        <ApiMethodDocumentation
          method="/persons"
          type="GET"
          description="Permet de lancer une recherche parmi les fiches individuelles."
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
                birthDate: '1932-11-29',
                birthPlace: 'Paris 5e Arrondissement, Paris, Île-de-France, France',
                deathDate: '2019-09-26',
                deathPlace: 'Paris 6e Arrondissement, Paris, Île-de-France, France',
                gender: true,
                nom: 'CHIRAC',
                prenom: 'Jacques René',
              }
            ],
          }}
        >
          <ApiMethodDocumentation.Parameter
            parameter="surname"
            description="Nom(s) de famille"
            type={typeString}
            isRequired
          />
          <ApiMethodDocumentation.Parameter
            parameter="name"
            description="Prénom(s)"
            type={typeString}
          />
          <ApiMethodDocumentation.Parameter
            parameter="place"
            description="Identifiant du lieu (voir ci-dessous)"
            type={typeIntegerPositive}
          />
          <ApiMethodDocumentation.Parameter
            parameter="event"
            description="Type d'événement"
            type={typeBirthOrDeath}
            defaultValue={DEFAULT_EVENT_TYPE}
          />
          <ApiMethodDocumentation.Parameter
            parameter="after"
            description="Borne inférieure sur l'année"
            type={typeYear}
          />
          <ApiMethodDocumentation.Parameter
            parameter="before"
            description="Borne supérieure sur l'année"
            type={typeYear}
          />
          <ApiMethodDocumentation.Parameter
            parameter="order"
            description="Ordre de tri"
            type={typeAscendingOrDescending}
            defaultValue={DEFAULT_ORDER_TYPE}
          />
          <ApiMethodDocumentation.Parameter
            parameter="offset"
            description="Décalage (fenêtre des résultats)"
            type={typeIntegerPositive}
            defaultValue={0}
          />
          <ApiMethodDocumentation.Parameter
            parameter="limit"
            description="Limite (fenêtre des résultats)"
            type={typeIntegerBetween(0, 100)}
            defaultValue={10}
          />
        </ApiMethodDocumentation>
        <h5>Recherche de lieux</h5>
        <ApiMethodDocumentation
          method="/places"
          type="GET"
          description="Permet d'obtenir l'identifiant d'un lieu, servant à d'autres requêtes."
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
            description="Recherche"
            type={typeString}
            isRequired
          />
          <ApiMethodDocumentation.Parameter
            parameter="limit"
            description="Limite (fenêtre des résultats)"
            type={typeIntegerBetween(0, 25)}
            defaultValue={10}
          />
        </ApiMethodDocumentation>
        <h5>Statistiques géographiques</h5>
        <ApiMethodDocumentation
          method="/stats/geography"
          type="GET"
          description="Permet de calculer des statistiques géographiques pour un nom."
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
            description="Nom(s) de famille"
            type={typeString}
            isRequired
          />
          <ApiMethodDocumentation.Parameter
            parameter="name"
            description="Prénom(s)"
            type={typeString}
          />
        </ApiMethodDocumentation>
        <h5>Statistiques annuelles</h5>
        <ApiMethodDocumentation
          method="/stats/time"
          type="GET"
          description="Permet de calculer des statistiques annuelles pour une recherche."
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
            description="Nom(s) de famille"
            type={typeString}
            isRequired
          />
          <ApiMethodDocumentation.Parameter
            parameter="name"
            description="Prénom(s)"
            type={typeString}
          />
          <ApiMethodDocumentation.Parameter
            parameter="place"
            description="Identifiant du lieu (voir ci-dessus)"
            type={typeIntegerPositive}
          />
          <ApiMethodDocumentation.Parameter
            parameter="event"
            description="Type d'événement"
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
