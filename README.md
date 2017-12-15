# CS4400 Internet Applications Assignment 2: Distributed Argon

# Features
- [x] Master-slave mode
- [x] Work-stealing mode
- [ ] REST Service__*__

__\*Note: I left this out as Stephen said (in the one-to-one meetings) that is it not needed and will not be marked.__

## Mode Implementation
### Master-slave
Each worker is given N jobs,  where `N = ceil(NumberOfCommits / NumberOfWorkers)`. Workers analyse entire commits with argon. When a worker is created, it will ask for a job from master, when that job is finished it will run a callback which then asks for another from the master process which creates a loop of complete a job and ask for another. The workers have their own job queue within the master and can only consume those jobs, when the given jobs are completed the worker is then killed.

### Work-stealing
This has a similar implementation to _Master-slave_ mode, the division of jobs is the same but the consuming process is different. Once workers have finished consuming their jobs on their own job queue the worker is not killed but it then will be given jobs from another worker's queue, so all workers are killed only when the total remaining job count has reached zero not their own total job count. 

## Worker Job Implementation
Once a worker gets a job, it will be in the form of a single commit. The worker copies a master-copy of the project repository into a new folder with a unique name which will be a combination of the commit and the worker's process id. The worker then resets the git branch head of said folder using `git reset --hard <commit short hash> -f`, once all that is finished it then runs argon on the folder repo. 

## Installation and Configuration
### Dependencies
* [NodeJS](https://nodejs.org/en/download/) LTS version.
* [Cabal](https://www.haskell.org/cabal/download.html) 

### Installing Dependencies
Run the following in your terminal within the project directory. This will install all relevant node modules dependences for the project and it will also run cabal install to get [argon](https://github.com/rubik/argon).
```bash
npm install
```

## Running
### Run custom config
```bash
project=<project-repo-url> workers=<number of workers> npm start
````
`workers` defaults to the number of availabe CPUs in the machine.
`project` defaults the [argon](https://github.com/rubik/argon) github repository project.

### Run test project
This will run the test project, which is the normal project repository running with the default project [argon](https://github.com/rubik/argon) with `worker=1..10`. It takes a while, I wouldn't do it again.
```bash
    silent=true bash run.sh
````

