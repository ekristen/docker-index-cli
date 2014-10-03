# Overview

The command line utility has pre-build commands for interacting with the internal API endpoints of the Docker Index. Endpoints for managing user access levels for various namespaces and repos, this is a critical component in managing your private registry/index.

## Docker Index

The Docker Index is available at https://github.com/ekristen/docker-index.git, it is also a trusted build available by using `docker pull ekristen/docker-index` (https://index.docker.io/u/ekristen/docker-index/)

# Requirements

* Docker Index (https://github.com/ekristen/docker-index.git)

# Installation

`npm install -g https://github.com/ekristen/docker-index-cli.git`

OR

`npm install -g docker-index-cli`

# Commands

## listUsers

This will return a list of users that are in the index database. These users will have various levels of access to namespaces and repositories.

*Usage:* `docker-index listUsers <index>`

## listPermissions

List all permissions associated with a user.

*Usage:* `docker-index listPermissions <user>@<index>`

## addPermission

Add an additional permission to a user.

*Usage:* `docker-index addPermission <user>@<index>/<repo> <permission>`

## removePermission

Remove a permission from a user.

*Usage:* `docker-index removePermission <user>@<index>/<repo>`

## listIndices

This will inspect the .dockercfg for your user and list what indexes/registries you have authenticated against.

*Usage:* `docker-index listIndices`

## listImages

This will list all images that have been pushed to the index. 

*Usage:* `docker-index listImages <namespace>`

## addUser

*Removed in Version 1.0.0*

Add a user to the index, once the user has been added permissions can be managed for the user.
