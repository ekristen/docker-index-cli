# Overview

The command line utility has pre-build commands for interacting with the internal API endpoints of the Docker Index. Endpoints for managing user access levels for various namespaces and repos, this is a critical component in managing your private registry/index.

## Docker Index

The Docker Index is available at https://github.com/ekristen/docker-index.git, it is also a trusted build available by using `docker pull ekristen/docker-index` (https://index.docker.io/u/ekristen/docker-index/)

# Requirements

* Docker Index (https://github.com/ekristen/docker-index.git)

# Overview

This is currently the tool to manage the https://github.com/ekristen/docker-index project. This tool requires that you have a `.dockercfg` file as it is used to determine which indexes you have configured and it uses the username and password combination to authenticate to the docker-index management API urls.

# Installation

## From NPM Registry (Preferred)

`npm install -g docker-index-cli`

## From Git

`npm install -g ekristen/docker-index-cli`

# Commands

## listUsers

This will return a list of users that are in the index database. These users will have various levels of access to namespaces and repositories.

**Usage:** `docker-index listUsers <index>`

## getUser

This will return basic information about a user including whether or not the account is disabled and all their permissions.

**Usage:** `docker-index getUser <user>@<index>`
  
## enableUser

This will enable a user in the index. The docker index has a *private* mode that will disable users by default when they login for the first time against the index. Use this function to unblock the account.

**Usage:** `docker-index enableUser <user>@<index>`
  
## disableUser

This will disable a user in the index. The account remains, and so does the permission set, but this will trigger an error any time the account is used against the register or the index.

**Usage:** `docker-index disableUser <user>@<index>`

## listPermissions

List all permissions associated with a user.

**Usage:** `docker-index listPermissions <user>@<index>`

## addPermission

Add an additional permission to a user.

**Usage:** `docker-index addPermission <user>@<index>/<repo> <permission>`

## removePermission

Remove a permission from a user.

**Usage:** `docker-index removePermission <user>@<index>/<repo>`

## listIndices

This will inspect the .dockercfg for your user and list what indexes/registries you have authenticated against.

**Usage:** `docker-index listIndices`

## listImages

This will list all images that have been pushed to the index. 

**Usage:** `docker-index listImages <namespace>`

## addUser

*Removed in Version 1.0.0*

Add a user to the index, once the user has been added permissions can be managed for the user.
