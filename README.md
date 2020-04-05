[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry&branch=master&metric=bugs)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry&branch=master&metric=code_smells)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry&branch=master&metric=coverage)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry&branch=master&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry&branch=master&metric=ncloc)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry&branch=master&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry&branch=master&metric=alert_status)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry&branch=master&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry&branch=master&metric=security_rating)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry&branch=master&metric=sqale_index)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry&branch=master&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry)

## Features

- A simple application to record reader responses.
- Be able to validate id, uid, and card numbers.
- Optional secure login options: id, uis, and passwords.
- Optional secure option: use aes to encrypt store.
- Optional secure option: hash reader responses.

## Getting started

- Develop: ```npm install && npm start```
- Deployment: ```npm run package```
  - Windows Executable: dist/*.exe 
  - Linux Executable: dist/*.AppImage
- Find store at:
  - Windows: %APPDATA%\ElectronIDSentry
  - Linux: ~/.config/ElectronIDSentry

## Going further

- An interface to choose node_id. 
- Automatically upgrade.
- Be able to generate config.
- Be able to manage, decrypt, convert json data files.
- Unit test (maybe mocha) and Code coverage (currently not measured).
- Any suggestions are welcome.

