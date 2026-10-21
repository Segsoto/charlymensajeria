import { execFileSync } from 'node:child_process';
import { access, mkdir, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'public');
const branch = 'refs/heads/codex/hostinger';
const git = (args, options = {}) => execFileSync('git', args, { cwd: root, encoding: 'utf8', ...options }).trim();
await access(resolve(output, 'index.html'));
await access(resolve(output, '.htaccess'));
const source = git(['rev-parse', 'HEAD']);
const remote = git(['ls-remote', '--heads', 'origin', branch]);
let parent;
if (remote) {
  git(['fetch', '--no-tags', 'origin', branch]);
  parent = git(['rev-parse', 'FETCH_HEAD']);
}

// Use a separate index: the source checkout, its branch and staged files stay intact.
await mkdir(resolve(root, '.build'), { recursive: true });
const index = resolve(root, '.build/hostinger.index');
await unlink(index).catch(error => { if (error.code !== 'ENOENT') throw error; });
const env = {
  ...process.env,
  GIT_DIR: git(['rev-parse', '--absolute-git-dir']),
  GIT_WORK_TREE: output,
  GIT_INDEX_FILE: index,
  GIT_AUTHOR_NAME: 'Charlie web publisher',
  GIT_AUTHOR_EMAIL: 'publisher@users.noreply.github.com',
  GIT_COMMITTER_NAME: 'Charlie web publisher',
  GIT_COMMITTER_EMAIL: 'publisher@users.noreply.github.com',
};
const artifactGit = args => git(args, { cwd: output, env });
artifactGit(['read-tree', '--empty']);
artifactGit(['add', '--all', '--force', '--', '.']);
const tree = artifactGit(['write-tree']);
if (parent && git(['rev-parse', `${parent}^{tree}`]) === tree) {
  console.log('Hostinger: no hay cambios en los archivos publicados.');
} else {
  const commit = artifactGit(['commit-tree', tree, ...(parent ? ['-p', parent] : []), '-m', `Publica sitio compilado desde ${source}`]);
  // Keep the release history; concurrent updates fail safely instead of forcing a push.
  git(['push', 'origin', `${commit}:${branch}`]);
  console.log(`Hostinger: rama codex/hostinger actualizada (${commit.slice(0, 7)}).`);
}
