.PHONY: lint-md repo-init sync-issues

# Skips the files `openspec init` generates; `openspec update` overwrites them.
lint-md:
	markdownlint-cli2 "**/*.md" "#.claude/skills/openspec-*/**" "#.claude/commands/opsx/**" "#**/node_modules"

repo-init:
	bash scripts/repo-init.sh

sync-issues:
	bash scripts/sync-issues.sh
