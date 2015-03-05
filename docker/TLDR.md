### Container Concepts
A linux container is a isolated userspace environment that has its own 
filesystem, process listing, and network stack. A container can be
constrained to only use a defined amount of resources.

Docker is a container virtualization platform that provides tools to:
 - create an image of a linux container
 - version the image
 - distribute the image
 - launch an instance of an image

### Container image

A docker image is a read-only 'snapshot' of a linux container file system.
When a docker image is launched a read-write file system is layered on top
of a images read-only file system (Union File System). Processes inside of
the running container write to the read-write file system layer, leaving
the read-only layer unchanged. 'Snapshotting' a running container results
in a read-only file system layered above the previous read-only file
(git commit for docker images, tracked by file system layers).

### Image versioning and distribution

Docker images are versioned by file system layer. Dockerhub is the github
for docker images. 

### Docker Container Entry point 

The default entry point process for every container is /bin/sh unless one 
is specified in the Dockerfile.

### Container pause, start, stop

Docker pauses and starts containers through use of cgroups freezer. Stopping
a container will send a SIGTERM to main process inside of container.

### Building an image (specifying image dependencies)

Two options:
1. Launch a base image, install app dependencies, 'snapshot' the running 
   container
2. Make option 1 repeatable with the use of a Dockerfile 

## Docker implementation details

Docker is a client-server architecture. The docker daemon builds, distributes,
and runs containers. A docker client and daemon communite via sockets or through
a RESTful API. The daemon uses the libcontainer library to manage lifecycle of
linux containers.

