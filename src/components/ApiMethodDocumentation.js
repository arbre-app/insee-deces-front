import PropTypes from 'prop-types';
import { Badge, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { Asterisk } from 'react-bootstrap-icons';

function ApiMethodDocumentationParameter({ parameter, description, type, defaultValue, isRequired }) {
  return (
    <tr>
      <td>
        <code>
          {parameter}
          {isRequired && (
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip id="tooltip-api-parameter-required">
                  Requis
                </Tooltip>
              }
            >
              <Asterisk className="icon ml-2" />
            </OverlayTrigger>
          )}
        </code>
      </td>
      <td>{description}</td>
      <td>{type}</td>
      <td>
        {isRequired ? (
          <em>
            (paramètre requis)
          </em>
        ) : (
          <code>{defaultValue}</code>
        )}
      </td>
    </tr>
  );
}

ApiMethodDocumentationParameter.propTypes = {
  parameter: PropTypes.string.isRequired,
  description: PropTypes.any.isRequired,
  type: PropTypes.any.isRequired,
  defaultValue: PropTypes.any,
  isRequired: PropTypes.bool,
};

ApiMethodDocumentationParameter.defaultProps = {
  defaultValue: null,
  isRequired: false,
};

export function ApiMethodDocumentation({ method, type, description, children, exampleUrl, exampleResult }) {
  return (
    <>
      <div className="mb-2">
        <Badge variant="primary" className="p-2">{type}</Badge>
        {' '}
        <kbd>{method}</kbd>
      </div>
      <div className="mb-2">
        {description}
      </div>
      <Table responsive>
        <thead>
        <tr>
          <th>Paramètre</th>
          <th>Description</th>
          <th>Type de valeur</th>
          <th>Valeur par défaut</th>
        </tr>
        </thead>
        <tbody>
        {children}
        </tbody>
      </Table>
      <strong>Exemple :</strong>
      <pre className="mt-2">
        <code>
          {type} <a href={exampleUrl} target="_blank" rel="noreferrer">{exampleUrl}</a>{'\n\n'}
          {JSON.stringify(exampleResult, null, 2)}
        </code>
      </pre>
    </>
  );
}

ApiMethodDocumentation.Parameter = ApiMethodDocumentationParameter;

ApiMethodDocumentation.propTypes = {
  method: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  description: PropTypes.any.isRequired,
  children: PropTypes.any.isRequired,
  exampleUrl: PropTypes.string.isRequired,
  exampleResult: PropTypes.object.isRequired,
};
