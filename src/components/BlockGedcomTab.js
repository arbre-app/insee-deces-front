import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { ShieldLockFill } from 'react-bootstrap-icons';
import { loadGedcomFile, useGedcomContext } from '../state/gedcom';

export function BlockGedcomTab() {
  const { state: { loading, filename }, dispatch } = useGedcomContext();
  const loadGedcomFileDispatch = file => dispatch(loadGedcomFile(file));
  const fileChangeHandler = e => {
    const files = e.target.files;
    if(files.length > 0) {
      const file = files[0];
      // Eventually we would like to have this method in a separate web worker
      loadGedcomFileDispatch(file);
    }
  };

  return (
    <div className="block block-form block-tab">
      <Row>
        <Col>
          Déposez un fichier Gedcom pour démarrer une comparaison automatique :
        </Col>
      </Row>
      <Row className="mt-2 justify-content-center">
        <Col xs={12} md={8} lg={6} xl={5}>
          <Form.File
            id="gedcom-file-input"
            label={filename ? filename : 'Sélectionner un fichier...'}
            data-browse="Fichier Gedcom"
            custom
            accept=".ged"
            onChange={fileChangeHandler}
            disabled={loading}
          />
        </Col>
      </Row>
      <Row className="mt-2 text-muted text-center">
        <Col xs={12}>
          <ShieldLockFill className="icon mr-2" />
          Votre fichier n'est pas transmis au serveur.
        </Col>
        <Col xs={12}>
          La comparaison ne sera exécutée qu'après avoir donné votre accord.
        </Col>
      </Row>
    </div>
  );
}
