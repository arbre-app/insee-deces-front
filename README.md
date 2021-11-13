insee-deces-front
=================

[**Live website**](https://arbre.app/en/insee)

This module implements the React app "French register of deceased persons" ("_Fichier des décès de l'Insee_").

* See [FlorianCassayre/insee-db](https://github.com/FlorianCassayre/insee-db) for the backend API.
* See [arbre-app/arbre.app](https://github.com/arbre-app/arbre.app) for the actual integration of that module.

## Development

Initially, run `npm install` to fetch and install the dependencies. Then:

* `npm start` to launch the development server, with hot reloading
* `npm run build:library` to build the module as a library
* `npm run build:standalone` to create a standalone app. In practice this command is not needed
* `npx serve build` to serve the aforementioned standalone app (you may have to run `npm install -g serve` before)
