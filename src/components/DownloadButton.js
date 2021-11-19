import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, Col, Dropdown, Form, FormControl, Modal, ProgressBar, Row, Spinner } from 'react-bootstrap';
import {
  ArrowsCollapse,
  CheckLg,
  ExclamationTriangle,
  ExclamationTriangleFill,
  FileEarmarkArrowDownFill,
  FileEarmarkCode,
  FileEarmarkSpreadsheet, InfoCircleFill,
} from 'react-bootstrap-icons';
import { Field, Form as FinalForm } from 'react-final-form';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { RESULTS_PER_PAGE } from '../config';
import { getPersonsFromFormData } from '../form';
import { useFormContext } from '../state/form';

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
  const intl = useIntl();
  const { state: formState } = useFormContext();
  const paginationSize = Math.max(...RESULTS_PER_PAGE);
  const canExportAll = formState.data.count <= MAX_EXPORT_COUNT;
  const [show, setShow] = useState(false);
  const [isExporting, setExporting] = useState(false);
  const [isDone, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isError, setError] = useState(false);
  const [isCsvWarning, setCsvWarning] = useState(false);
  const handleButtonClick = e => {
    e.target.blur();
    setShow(true);
    setDone(false);
    setProgress(0);
    setError(false);
    setCsvWarning(false);
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
  const availableCsvFieldSeparators = {
    comma: {
      name: intl.formatMessage({ id: 'export.select_value_separator.value.comma' }),
      symbol: ',',
    },
    semicolon: {
      name: intl.formatMessage({ id: 'export.select_value_separator.value.semicolon' }),
      symbol: ';',
    },
    tab: {
      name: intl.formatMessage({ id: 'export.select_value_separator.value.tab' }),
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
    actCode: 'acte',
  };
  const fieldNamesOrder = ['nom', 'prenom', 'gender', 'birthDate', 'birthPlace', 'deathDate', 'deathPlace', 'actCode'];
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
          if (value == null) {
            return '';
          } else if (value.includes(fieldSeparator)) {
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
  const renderForm = ({ handleSubmit, values, form: { mutators: { setValue } } }) => {
    return (
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton={!isExporting}>
          <Modal.Title><FormattedMessage id="export.title" /></Modal.Title>
        </Modal.Header>
        {isDone ? (!isError ? (
          <Modal.Body className="text-center">
            <h1 className="text-success">
              <CheckLg className="icon" />
            </h1>
            <FormattedMessage id="export.success" />
            {isCsvWarning && (
              <div className="mt-5">
                <h2 className="h5">
                  <InfoCircleFill className="icon mr-2" />
                  <FormattedMessage id="export.tips.csv.title" />
                </h2>
                <div className="text-left">
                  <p>
                    <FormattedMessage id="export.tips.csv.description" />
                  </p>
                  <ul className="pl-4">
                    <li>
                      <FormattedMessage id="export.tips.csv.charset_encoding" values={{ charset: <strong>Unicode</strong>, encoding: <strong>UTF-8</strong> }} />
                    </li>
                    <li>
                      <FormattedMessage id="export.tips.csv.cells_format" />
                      <ul className="pl-4">
                        <li>
                          <FormattedMessage id="export.tips.csv.cells_format_for_columns" values={{
                            format: <strong><FormattedMessage id="export.tips.csv.cells_format_text" /></strong>,
                            columns: <FormattedMessage id="export.tips.csv.columns_text" values={{
                              surname: <code>{fieldNamesFrench.nom}</code>,
                              given_name: <code>{fieldNamesFrench.prenom}</code>,
                              gender: <code>{fieldNamesFrench.gender}</code>,
                              birth_place: <code>{fieldNamesFrench.birthPlace}</code>,
                              death_place: <code>{fieldNamesFrench.deathPlace}</code>,
                              act_code: <code>{fieldNamesFrench.actCode}</code>
                            }} />
                          }} />
                        </li>
                        <li>
                          <FormattedMessage id="export.tips.csv.cells_format_for_columns" values={{
                            format: <strong><FormattedMessage id="export.tips.csv.cells_format_date" /></strong>,
                            columns: <FormattedMessage id="export.tips.csv.columns_date" values={{
                              birth_date: <code>{fieldNamesFrench.birthDate}</code>,
                              death_date: <code>{fieldNamesFrench.deathDate}</code>,
                            }} />
                          }} />
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </Modal.Body>
        ) : (
          <Modal.Body className="text-center">
            <h1 className="text-danger">
              <ExclamationTriangle className="icon" />
            </h1>
            <FormattedMessage id="export.error" />
          </Modal.Body>
        )) : isExporting ? (
          <Modal.Body className="text-center">
            <div className="mb-2">
              <Spinner animation="border" />
            </div>
            <FormattedMessage id="export.loading" />
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
                    <FormattedMessage id="export.radio.current_page" values={{ entries: <strong><FormattedNumber value={formState.data.results.length} /></strong>, n: formState.data.results.length }} />
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
                      <FormattedMessage id="export.radio.first" />
                      <Field
                        name="exportFirst"
                        render={({ input: childInput }) => (
                          <FormControl type="number" disabled={!input.checked} min={1} max={MAX_EXPORT_COUNT}
                                       placeholder={intl.formatMessage({ id: 'export.amount' })} {...childInput} />
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
                      <FormattedMessage id="export.radio.all" values={{ entries: <strong><FormattedNumber value={formState.data.count} /></strong>, n: formState.data.count }} />
                      {!canExportAll && (
                        <span className="text-warning"><ExclamationTriangleFill className="icon ml-3 mr-2" />&#62; <FormattedNumber value={MAX_EXPORT_COUNT} /></span>
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
                      label={<FormattedMessage id="export.select_format.label" />}
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
                              label={<FormattedMessage id="export.select_value_separator.label" />}
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
                              label={<FormattedMessage id="export.select_line_separator.label" />}
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
              <FormattedMessage id="export.button_cancel" />
            </Button>
          )}*/}
          {!isExporting && (
            <Button variant="dark" onClick={handleHide}>
              <ArrowsCollapse className="icon mr-2" />
              <FormattedMessage id="export.button_close" />
            </Button>
          )}
          <Button type="submit" variant="primary" disabled={isExporting || isDone}>
            <FileEarmarkArrowDownFill className="icon mr-2" />
            <FormattedMessage id="export.button_download" />
          </Button>
        </Modal.Footer>
      </Form>
    );
  };
  const submitHandler = data => {
    const prefix = intl.formatMessage({ id: 'export.filename' });
    const filename = `${prefix}.${availableFileFormats[data.exportFileFormat].extension}`;
    setCsvWarning(data.exportFileFormat === EXTENSION_CSV);
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
