# CS4400 Internet Applications Assignment 2: Distributed Argon

# Features
- [x] Master-slave mode
- [x] Work-stealing mode
- [ ] REST Service__*__

__\*Note: I left this out as Stephen said (in the one-to-one meetings) that is it not needed and will not be marked.__

## Mode Implementation
### Master-slave
Each worker is given N jobs,  where `N = NumberOfCommits / NumberOfWorkers` and any remaining jobs are put on the first workers queue. Workers analyse entire commits with argon. When a worker is created, it will ask for a job from master, when that job is finished it will run a callback which then asks for another from the master process which creates a loop of complete a job and ask for another. The workers have their own job queue within the master and can only consume those jobs, when the given jobs are completed the worker is then killed.

### Work-stealing
This has a similar implementation to _Master-slave_ mode, the division of jobs is the same but the consuming process is different. Once workers have finished consuming their jobs on their own job queue the worker is not killed but it then will be given jobs from another worker's queue, so all workers are killed only when the total remaining job count has reached zero not their own total job count. 

Stealing a job can be unsuccessful, the job returning can be `undefined`, when this happens the worker will be ask for another till it gets one that is defined. This happens because the stealing process attempts to off the queue of random worker `RandomJob = JobQueue[random].pop()` where `random = floor(NumberOfWorkers * rand())`.

## Worker Job Implementation
Once a worker gets a job, it will be in the form of a single commit. The worker copies a master-copy of the project repository into a new folder with a unique name which will be a combination of the commit and the worker's process id. The worker then resets the git branch head of said folder using `git reset --hard <commit short hash> -f`, once all that is finished it then runs argon on the folder repo.

## Timing 
Time is measured from the start of the first worker where the git repository has already been fetched, to not take the network time into account, and the commits have been taken from the repo, and then the end is when the master has closed. Time taken to copy the repo into new folders for each commit is also in the final time so potential bottle-necking from the users disk can be a factor. 

## Results
### Setup
All tests were run my own laptop, which features...
CPU | Memory | Disk
---|---|---
Dual-core Intel Core i5 @ 1.4 GHz | 8GB | SSD

### Running on a small repo first
Project: [HaskellStarter](https://github.com/joshcough/HaskellStarter)
#Workers | master-slave | work-stealing
---|----|----
1 | 24.49s | 24.199s
2 | 16.358s | 12.944s
3 | 12.539s | 10.089s
4 | 9.742s | 9.326s
5 | 9.091s | 8.35s
6 | 9.078s | 8.494s
7 | 8.787s | 8.567s
8 | 8.85s | 9.519s
9 | 9.373s | 9.776s
10 | 9.13s | 9.609s

### Running on a argon
Project: [argon](https://github.com/rubik/argon)
Running with `workers=1,2,5,10`

#Workers | master-slave | work-stealing
---|----|----
1 | 151.622s | 152.406s
2 | 109.174s | 77.308s
5 | 68.69s | 65.506s
10 | 57.635s | 54.931s

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
[project=<project-repo-url>] [workers=<number of workers>] [WorkStealing=<true|false>] [silent=<true|false>] npm start
````
`workers` defaults to the number of availabe CPUs in the machine.
`project` defaults the [argon](https://github.com/rubik/argon) github repository project.
`WorkStealing` defaults to false, so master-slave mode normally runs
`silent` defaults to false, so you'll see communcation between master and workres

### Run test project
This will run the test project, which is the normal project repository running with the default project [argon](https://github.com/rubik/argon) with `worker=1..10`. It takes a while, I wouldn't do it again.
```bash
    silent=true bash run.sh
````

