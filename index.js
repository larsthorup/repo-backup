const fs = require('fs');

const execa = require('execa');
const got = require('got');

const groupList = ['fullstackagile'];
const userList = ['sjuthorup'];

async function main()
{
  let repoList = [];
  for (const group of groupList) {
    const projectList = await got(`https://gitlab.com/api/v4/groups/${group}/projects`).json();
    repoList = repoList.concat(projectList.map(project => project.web_url))
  }
  for (const user of userList) {
    const projectList = await got(`https://gitlab.com/api/v4/users/${user}/projects`).json();
    repoList = repoList.concat(projectList.map(project => project.web_url))
  }
  fs.rmdirSync('gitlab', { recursive: true });
  fs.mkdirSync('gitlab');
  for (const repo of repoList) {
    console.log('cloning', repo)
    const gitProcess = execa('git', ['clone', repo], { cwd: 'gitlab' });
    gitProcess.stdout.pipe(process.stdout);
    await gitProcess;
  }
}

main().catch(console.error).then(() => console.log('done'));
