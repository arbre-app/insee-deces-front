import PropTypes from 'prop-types';
import { Pagination } from 'react-bootstrap';
import {
  ArrowLeft,
  ArrowRightShort,
  ExclamationTriangle,
  QuestionCircle,
  Search,
  Shield,
} from 'react-bootstrap-icons';

export function BlockInformation({ onBackClick }) {
  const clickHandler = e => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      left: 0,
    });
    onBackClick();
  };
  const renderBackButton = () => (
    <Pagination className="my-0">
      <Pagination.First onClick={clickHandler}>
        <ArrowLeft className="icon mr-2" />
        Revenir au formulaire de recherche
      </Pagination.First>
    </Pagination>
  );
  return (
    <>

      <div className="block">
        {renderBackButton()}
        <div className="my-2">
          <h3>Informations</h3>
          <h5>
            <ExclamationTriangle className="icon mr-2" />
            Remarques importantes
          </h5>
          <p>
            Ce service repose sur les <a href="https://www.insee.fr/fr/information/4190491" target="_blank" rel="noreferrer">données fournies par l'Insee</a> (fichier des personnes décédées depuis 1970).
            L'Insee <strong>ne peut pas garantir</strong> que ces données soit exemptes d'omissions ou d'erreurs.
            En particulier ces informations n'ont pas de valeur légale : seul l'acte d'état civil fait foi, pour lequel une copie peut être demandée à la mairie concernée.
            Il n'existe pas pour le moment de mécanisme pour signaler les éventuelles erreurs.
          </p>
          <h5>
            <Search className="icon mr-2" />
            Paramètres de recherche
          </h5>
          <ul>
            <li>
              <strong>Noms et prénoms</strong> -
              Pour lancer une recherche vous devrez entrer au moins un nom, il n'est pas obligatoire d'entrer un prénom.
              Vous pouvez entrer plusieurs noms et/ou prénoms, ne seront retournées que les fiches contenant tous les noms et prénoms recherchés peu importe leur ordre.
              L'accentuation n'est pas prise en compte et les noms composés sont séparés.
            </li>
            <li>
              <strong>Lieux</strong> -
              Vous pouvez indiquer un lieu pour affiner la recherche.
              Il peut s'agir d'une commune, d'un département, d'une région ou d'un pays.
              Seuls les résultats pour ayant au moins un événement correspondant à ce lieu seront retenus.
            </li>
            <li>
              <strong>Dates</strong> -
              Vous pouvez également affiner la recherche par dates.
              Pour ce faire vous devrez choisir un type d'événement, naissance ou décès, puis indiquer une période en années.
              Enfin vous pouvez modifier l'ordre d'affichage des résultats, par dates croissantes ou décroissantes, pour ce même événement.
            </li>
          </ul>
          <h5>
            <Shield className="icon mr-2" />
            Confidentialité
          </h5>
          <p>
            Ce service ne contient aucun traceur et n'utilise pas de cookies.
            Des journaux d'accès sont conservés temporairement afin d'assurer le bon fonctionnement du service.
            Les fiches individuelles ne sont pas indexées par les moteurs de recherche.
          </p>
          <h5>
            <QuestionCircle className="icon mr-2" />
            Foire aux questions
          </h5>
          <h6>Je ne trouve pas ce que je recherche, pourquoi ?</h6>
          <p>
            <ArrowRightShort className="icon mr-1" />
            TODO
          </p>
          <h6>Une fiche contient une erreur, que faire ?</h6>
          <p>
            <ArrowRightShort className="icon mr-1" />
            Malheureusement l'Insee ne propose pas de système de rectification pour le moment.
            Il n'y a donc rien à faire.
          </p>
          <h6>
            Puis-je demander la suppression de la fiche d'un proche ?
          </h6>
          <p>
            <ArrowRightShort className="icon mr-1" />
            Conformément au <a href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000034708124/2019-12-31/" target="_blank" rel="noreferrer">décret n°2017-890 relatif à l'état civil, article 30, alinéa 6</a>, "<em>les copies intégrales des actes de décès [...] peuvent être délivrées à toute personne</em>".
            Le RGPD quant à lui ne s'applique qu'aux personnes vivantes.
            Pour des raisons pratiques ce site utilise les données originales sans appliquer de modifications, il n'est donc pas proposé de procédure de suppression.
          </p>
        </div>
        {renderBackButton()}
      </div>
    </>

  );
}

BlockInformation.propTypes = {
  onBackClick: PropTypes.func.isRequired,
};
