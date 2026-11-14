// Mensagens de commit no padrão Conventional Commits (feat, fix, docs, chore, refactor, test, ci, perf, style, build, revert).
export default {
  extends: ['@commitlint/config-conventional'],
  rules: { 'subject-case': [0], 'body-max-line-length': [0], 'footer-max-line-length': [0], 'header-max-length': [2, 'always', 100] },
};
