## Container Concepts
A linux container is a isolated userspace environment that has its own 
filesystem, process listing, and network stack. 

Docker is a virtualization platform that provides tools to:
 - create an image of a linux container
 - version the image
 - distribute the image
 - launch an instance of an image

### Container imaging 

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

### Launching Container Images


## Docker implementation details

### Daemon

### Client
