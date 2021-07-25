import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, Col, Dropdown, Form, FormControl, Modal, ProgressBar, Row, Spinner } from 'react-bootstrap';
import {
  ArrowsCollapse,
  CheckLg, ExclamationTriangle,
  ExclamationTriangleFill,
  FileEarmarkArrowDownFill,
  FileEarmarkCode,
  FileEarmarkSpreadsheet,
  StopCircle,
} from 'react-bootstrap-icons';
import { Field, Form as FinalForm } from 'react-final-form';
import { FormattedNumber } from 'react-intl';
import { useSelector } from 'react-redux';
import { RESULTS_PER_PAGE } from '../config';
import { getPersonsFromFormData } from '../form';

const EXTENSION_CSV = 'csv';
const EXTENSION_JSON = 'json';

const EXPORT_CURRENT = 'current';
const EXPORT_FIRST_N = 'first';
const EXPORT_ALL = 'all';

const MAX_EXPORT_COUNT = 2500;

function SelectionInput({ name, value, values, label, renderValue, setValue }) {
  return (
    <Row className="mt-1">
      <Col xs={6} sm={5} className="my-auto">
        {label}
      </Col>
      <Col xs={6} sm={7}>
        <Dropdown as="span">
          <Dropdown.Toggle variant="light" id="dropdown-basic">
            {renderValue(values[value])}
          </Dropdown.Toggle>
          <Dropdown.Menu className="width-min">
            {Object.entries(values).map(([key, v]) => (
              <Dropdown.Item key={key} active={value === key}
                             onClick={() => setValue(name, key)}>
                {renderValue(v)}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  );
}

SelectionInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
  label: PropTypes.any.isRequired,
  renderValue: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
};

export function DownloadButton({ disabled, ...props }) {
  const formState = useSelector(state => state.form);
  const paginationSize = Math.max(...RESULTS_PER_PAGE);
  const canExportAll = formState.data.count <= MAX_EXPORT_COUNT;
  const [show, setShow] = useState(false);
  const [isExporting, setExporting] = useState(false);
  const [isDone, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isError, setError] = useState(false);
  const handleButtonClick = e => {
    e.target.blur();
    setShow(true);
    setDone(false);
    setProgress(0);
    setError(false);
  };
  const handleHide = () => {
    if(!isExporting) { // Cannot hide if exporting
      setShow(false);
    }
  };
  const availableFileFormats = {
    [EXTENSION_CSV]: {
      name: 'CSV',
      icon: FileEarmarkSpreadsheet,
      extension: EXTENSION_CSV,
    },
    [EXTENSION_JSON]: {
      name: 'JSON',
      icon: FileEarmarkCode,
      extension: EXTENSION_JSON,
    },
  };
  const renderFileFormat = ({ name, icon: Icon }) => (
    <>
      <Icon className="icon mr-2" />
      {name}
    </>
  );
  const availableCsvFieldSeparators = {
    comma: {
      name: 'Virgule',
      symbol: ',',
    },
    semicolon: {
      name: 'Point-virgule',
      symbol: ';',
    },
    tab: {
      name: 'Tabulation',
      symbol: '\t',
    },
  };
  const availableCsvLineSeparators = {
    lf: {
      name: 'Unix',
      symbol: '\n',
    },
    crlf: {
      name: 'Windows',
      symbol: '\r\n',
    },
  };
  const fieldNamesFrench = { // TODO localize that
    nom: 'nom',
    prenom: 'prenom',
    gender: 'sexe',
    birthDate: 'date_naissance',
    birthPlace: 'lieu_naissance',
    deathDate: 'date_deces',
    deathPlace: 'lieu_deces',
  };
  const fieldNamesOrder = ['nom', 'prenom', 'gender', 'birthDate', 'birthPlace', 'deathDate', 'deathPlace'];
  const genderNamesFrench = {
    male: 'M',
    female: 'F',
  };
  const defaultGender = '?';
  const dataToString = (array, fileFormat, options) => {
    const transformGender = gender => gender != null ? (gender ? genderNamesFrench.male : genderNamesFrench.female) : defaultGender;
    if (fileFormat === EXTENSION_CSV) {
      const lines = [];
      const fieldSeparator = availableCsvFieldSeparators[options.exportCsvFieldSeparator].symbol;
      const lineSeparator = availableCsvLineSeparators[options.exportCsvLineSeparator].symbol;
      lines.push(fieldNamesOrder.map(key => fieldNamesFrench[key]).join(fieldSeparator));
      array.forEach(obj => lines.push(
        fieldNamesOrder.map(key => {
          const value = key !== 'gender' ? obj[key] : transformGender(obj[key]);
          if (value.includes(fieldSeparator)) {
            const doubleQuotes = '"';
            return doubleQuotes + value.replaceAll(doubleQuotes, doubleQuotes + doubleQuotes) + doubleQuotes;
          } else {
            return value;
          }
        }).join(fieldSeparator)
      ));
      return lines.join(lineSeparator);
    } else if (fileFormat === EXTENSION_JSON) {
      const cleanArray = array.map(obj => Object.fromEntries(fieldNamesOrder.map(key => {
        const cleanValue = key !== 'gender' ? obj[key] : transformGender(obj[key]);
        return [fieldNamesFrench[key], cleanValue];
      })));
      if (options.exportJsonPretty.length > 0) {
        const spacing = 2;
        return JSON.stringify(cleanArray, null, spacing);
      } else {
        return JSON.stringify(cleanArray);
      }
    } else {
      throw new Error();
    }
  };
  const downloadStringAsFile = (str, filename) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(str));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  const renderCsvFieldSeparator = ({ name }) => name;
  const renderCsvLineSeparator = ({ name }) => name;
  const renderCountPreview = count => ( // TODO pluralize
    <>
      (<strong><FormattedNumber value={count} /></strong> fiches)
    </>
  );
  const renderForm = ({ handleSubmit, values, initialValues, form: { mutators: { setValue } } }) => {
    return (
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton={!isExporting}>
          <Modal.Title>Exporter les résultats</Modal.Title>
        </Modal.Header>
        {isDone ? (!isError ? (
          <Modal.Body className="text-center">
            <h1 className="text-success">
              <CheckLg className="icon" />
            </h1>
            Données téléchargées avec succès.
          </Modal.Body>
        ) : (
          <Modal.Body className="text-center">
            <h1 className="text-danger">
              <ExclamationTriangle className="icon" />
            </h1>
            Une erreur est survenue.
          </Modal.Body>
        )) : isExporting ? (
          <Modal.Body className="text-center">
            <div className="mb-2">
              <Spinner animation="border" />
            </div>
            Téléchargement des données en cours...
            <ProgressBar min={0} max={1} now={progress} className="mt-2" />
          </Modal.Body>
        ) : (
          <Modal.Body>
            <div>
              <Field
                name="exportSize"
                type="radio"
                value={EXPORT_CURRENT}
                render={({ input }) => (
                  <Form.Check id="export-radio-current" label={(
                    <>La page courante {renderCountPreview(formState.data.results.length)}</>
                  )} {...input} />
                )}
              />
              <Field
                name="exportSize"
                type="radio"
                value={EXPORT_FIRST_N}
                render={({ input }) => ( // TODO pluralize
                  <Form.Check id="export-radio-first-n" label={(
                    <div>
                      Les premières fiches :{' '}
                      <Field
                        name="exportFirst"
                        render={({ input: childInput }) => (
                          <FormControl type="number" disabled={!input.checked} min={1} max={MAX_EXPORT_COUNT}
                                       placeholder="Quantité" {...childInput} />
                        )} />
                    </div>
                  )} {...input} />
                )}
              />
              <Field
                name="exportSize"
                type="radio"
                value={EXPORT_ALL}
                render={({ input }) => (
                  <Form.Check id="export-radio-all" disabled={!canExportAll} label={(
                    <>
                      Tous les résultats {renderCountPreview(formState.data.count)}
                      {!canExportAll && (
                        <span className="text-warning"><ExclamationTriangleFill className="icon ml-3 mr-2" />> <FormattedNumber value={MAX_EXPORT_COUNT} /></span>
                      )}
                    </>
                  )} {...input} />
                )}
              />
            </div>
            <div className="mt-4">
              <Field
                name="exportFileFormat"
                render={({ input: { value, name } }) => (
                  <>
                    <SelectionInput
                      name={name}
                      value={value}
                      values={availableFileFormats}
                      label={(
                        <>
                          Format des données :
                        </>
                      )}
                      renderValue={({ name, icon: Icon }) => (
                        <>
                          <Icon className="icon mr-2" />
                          {name}
                        </>
                      )}
                      setValue={setValue}
                    />
                    {value === EXTENSION_CSV && (
                      <>
                        <Field
                          name="exportCsvFieldSeparator"
                          render={({ input: { value: childValue, name: childName } }) => (
                            <SelectionInput
                              name={childName}
                              value={childValue}
                              values={availableCsvFieldSeparators}
                              label={(
                                <>
                                  Séparateur de valeurs :
                                </>
                              )}
                              renderValue={({ name }) => (
                                <>
                                  {name}
                                </>
                              )}
                              setValue={setValue}
                            />
                          )}
                        />
                        <Field
                          name="exportCsvLineSeparator"
                          render={({ input: { value: childValue, name: childName } }) => (
                            <SelectionInput
                              name={childName}
                              value={childValue}
                              values={availableCsvLineSeparators}
                              label={(
                                <>
                                  Séparateur de lignes :
                                </>
                              )}
                              renderValue={({ name }) => (
                                <>
                                  {name}
                                </>
                              )}
                              setValue={setValue}
                            />
                          )}
                        />
                      </>
                    )}
                    {value === EXTENSION_JSON && (
                      <Field
                        name="exportJsonPretty"
                        type="checkbox"
                        value="checked"
                        render={({ input: childInput }) =>
                          <Form.Check id="export-radio-json-pretty" label="Formatter le code" {...childInput} />
                        }
                      />
                    )}
                  </>
                )}
              />
            </div>
          </Modal.Body>
        )}
        <Modal.Footer>
          {/*{isExporting && (
            <Button variant="danger">
              <StopCircle className="icon mr-2" />
              Annuler
            </Button>
          )}*/}
          {!isExporting && (
            <Button variant="dark" onClick={handleHide}>
              <ArrowsCollapse className="icon mr-2" />
              Fermer
            </Button>
          )}
          <Button type="submit" variant="primary" disabled={isExporting || isDone}>
            <FileEarmarkArrowDownFill className="icon mr-2" />
            Télécharger
          </Button>
        </Modal.Footer>
      </Form>
    );
  };
  const submitHandler = data => {
    const filename = `Recherche.${availableFileFormats[data.exportFileFormat].extension}`;
    if (data.exportSize === EXPORT_CURRENT) {
      const resultString = dataToString(formState.data.results, data.exportFileFormat, data);
      downloadStringAsFile(resultString, filename);
      setDone(true);
    } else if (data.exportSize === EXPORT_FIRST_N || data.exportSize === EXPORT_ALL) {
      const exportFirst = data.exportSize === EXPORT_FIRST_N ? data.exportFirst : formState.data.count;
      const pagesToFetch = Math.ceil(exportFirst / paginationSize);

      setExporting(true);

      const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

      const fetcher = async () => {
        let data = [];
        for(let i = 1; i <= pagesToFetch; i++) {
          const result = await getPersonsFromFormData({
            ...formState.form,
            currentPage: i,
            resultsPerPage: paginationSize,
          });
          result.results.forEach(entry => data.push(entry));
          setProgress(i / (pagesToFetch - 1));
        }
        return data;
      };

      fetcher().then(result => {
        const resultString = dataToString(result, data.exportFileFormat, data);
        downloadStringAsFile(resultString, filename);
        setExporting(false);
        setDone(true);
      }).catch(error => {
        console.error(error);
        setError(true);
        setExporting(false);
        setDone(true);
      });

      // TODO
    } else {
      throw new Error();
    }
    // TODO
  };

  return (
    <>
      <Button variant="secondary" disabled={disabled} onClick={handleButtonClick} {...props}>
        <FileEarmarkArrowDownFill className="icon" />
      </Button>
      <Modal show={show} onHide={handleHide}>
        <FinalForm
          onSubmit={submitHandler}
          mutators={{
            setValue: ([field, value], state, { changeValue }) => changeValue(state, field, () => value),
          }}
          initialValues={{
            exportFileFormat: EXTENSION_CSV,
            exportSize: EXPORT_CURRENT,
            exportFirst: paginationSize,
            exportCsvFieldSeparator: 'comma',
            exportCsvLineSeparator: 'crlf',
            exportJsonPretty: ['checked'],
          }}
          render={renderForm}
        />
      </Modal>
    </>
  );
}

DownloadButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
};
