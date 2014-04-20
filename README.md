* **Status:** Heavy Development (Alpha)
* **Warning:** Command Structure may change, under heavy development

# Overview

The command line utility has pre-build commands for interacting with the internal API endpoints of the Docker Index. Endpoints for managing user access levels for various namespaces and repos, this is a critical component in managing your private registry/index.

## Docker Index

The Docker Index is available at https://github.com/ekristen/docker-index.git, it is also a trusted build available by using `docker pull ekristen/docker-index` (https://index.docker.io/u/ekristen/docker-index/)

# Requirements

* Docker Index (https://github.com/ekristen/docker-index.git)

# Installation

`npm install -g https://github.com/ekristen/docker-index-cli.git`

* **Note:** I do plan to publish this to the NPM registry once I come out of alpha status.

# Commands

## listUsers

This will return a list of users that are in the index database. These users will have various levels of access to namespaces and repositories.

## addUser

Add a user to the index, once the user has been added permissions can be managed for the user.

## listPermissions

List all permissions associated with a user.

## addPermission

Add an additional permission to a user.

## removePermission

Remove a permission from a user.

## listIndexes

This will inspect the .dockercfg for your user and list what indexes/registries you have authenticated against.

## listImages

This will list all images that have been pushed to the index. 

## setIndex

You can use this command to set your default index that the `docker-index` command will use by default, otherwise you will have to specify --index with all commands. This will save the value to ~/.indexcfg.

