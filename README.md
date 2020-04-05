[![platform](https://img.shields.io/badge/platform-linux%2Fwindows-green.svg)](https://github.com/tarlety/id_sentry)
[![License](https://img.shields.io/:license-mit-blue.svg)](https://github.com/tarlety/id_sentry/blob/master/LICENSE)
[![Release Version](https://img.shields.io/github/v/release/tarlety/id_sentry?sort=semver)](https://github.com/tarlety/id_sentry/releases)
[![Commits Since Latest Release](https://img.shields.io/github/commits-since/tarlety/id_sentry/latest/master?include_prereleases)](https://github.com/tarlety/id_sentry/commits/master)
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
[![Snyk Known Vulnerabilities](https://snyk.io/test/github/tarlety/id_sentry/badge.svg)](https://snyk.io/test/github/tarlety/id_sentry)

## Features

- A simple application to record reader responses.
- Be able to validate id, uid, and card numbers.
- Optional secure login options: id, uis, and passwords.
- Optional secure option: use aes to encrypt store.
- Optional secure option: hash reader responses.
- Supported platforms: Linux, Windows.

## Getting started

- Develop: ```npm install && npm start```
- Deployment: ```npm run package```
  - Windows Executable: dist/*.exe 
  - Linux Executable: dist/*.AppImage
- Find store at:
  - Windows: %APPDATA%\ElectronIDSentry
  - Linux: ~/.config/ElectronIDSentry

## Source Code Management

- Branches:
  - master: the latest code branch under developing, shall be production ready.
  - release: formal releases and rc releases.
  - dev-feature: under developing feature.
- Code Structure:
  - src: the electron app entry point.
  - scripts: help to install or execute specific tasks in production environment.

## Going further

- An interface to choose node_id. 
- Automatically upgrade.
- Be able to generate config.
- Be able to manage, decrypt, convert json data files.
- Help wanted: branch dev-unittest implements Unit Test by Jest.
- Any suggestions are welcome.

