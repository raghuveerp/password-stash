# Password Vault Application

This application is very small node js based application which has GET APIs to return passwords.

## Pre Requisites

Following are the packages that needs to be installed on the host in order to run this application

* Node and NPM : https://nodejs.org/en/download/
* Gulp : http://gulpjs.com/
* APIDocJS : http://apidocjs.com/

## Building the Code

This project uses node modules and hence requires internet connectivity. All the node modules will be installed under node_modules folder. In order to build, please execute the following command

``$ npm install``

## Running the instance locally

This project relies on Gulp for running locally so that all the latest changes done are automatically picked up by the node js server. To run this application, please execute the following command

``$ gulp``

## Creating documents

The documentation is done using apidocjs. In order to create documents, apidoc should be installed on the host. Please execute this command to generate documents.

``$ apidoc -i routes/ -o docs/``