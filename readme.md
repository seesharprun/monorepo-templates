# Monorepo templates

Two self-contained [Azure Developer CLI (`azd`)](https://learn.microsoft.com/azure/developer/azure-developer-cli/overview) templates that live side by side in a single repository:

| Directory | Template name | Azure host | Stack |
| --- | --- | --- | --- |
| [`web/`](web/) | `web-appservice` | Azure App Service (Linux) | Node.js + Express, zip deploy |
| [`api/`](api/) | `api-containerapp` | Azure Container Apps | Node.js + Express + Docker, ACR remote build |

Each subdirectory is a complete `azd` template with its own `azure.yaml`, `infra/` (Bicep), and `src/`.

## How `azd` finds a template in a monorepo

`azd` loads the `azure.yaml` for the **current working directory**, walking up parent folders until it finds one. Because each template keeps its `azure.yaml` in its own subfolder — and there is intentionally **no** `azure.yaml` at the repo root — you pick a template by pointing `azd` at its folder:

```powershell
# Option A: change into the template folder
cd web
azd up

# Option B: stay at the root and target the folder with -C/--cwd
azd -C web up      # deploy the App Service template
azd -C api up      # deploy the Container Apps template
```

Running `azd up` at the repo root fails on purpose (`no project exists`), which prevents ambiguity about *which* template you meant.

## Get the code

```powershell
git clone https://github.com/seesharprun/monorepo-templates
cd monorepo-templates/web   # or: cd monorepo-templates/api
azd up
```

`azd init --template seesharprun/monorepo-templates .` also works, but it **clones the entire repository** (both templates). `azd` cannot pull a single remote subdirectory as a template — see [Why one repo, two templates needs a folder step](#why-one-repo-two-templates-needs-a-folder-step).

## Make the templates discoverable (template source)

A [template source](https://learn.microsoft.com/azure/developer/azure-developer-cli/configure-template-sources) is a JSON catalog that feeds `azd template list` and `azd init`. This repo ships one at [`templates.json`](templates.json). Register it and list the entries:

```powershell
azd template source add monorepo `
  --type url `
  --location https://raw.githubusercontent.com/seesharprun/monorepo-templates/main/templates.json `
  --name "Monorepo templates"

azd template list --source monorepo
```

Each catalog entry's `repositoryPath` resolves to a whole repository, so an entry clones the full monorepo; you then `cd` into `web/` or `api/`.

## Why one repo, two templates needs a folder step

`azd init --template <x>` accepts a full Git URI, `<owner>/<repository>`, `<repository>` (Azure-Samples), or a local path, and it **shallow-clones the entire repository**. There is no remote-subdirectory extraction in `azd` core, so `azd init --template owner/repo/web` is not supported. A template source does not change this: its `repositoryPath` is still a whole repo. Native workspace/mono-repo support is tracked in [Azure/azure-dev#3789](https://github.com/Azure/azure-dev/issues/3789).

Ways to ship two templates in one repo today:

- **Subdirectories + folder select (this repo).** Clone once, then `cd web` / `cd api` (or `azd -C web`). Simple and true to "one repo."
- **Branch per template.** Keep each template at the root of its own branch and init with `azd init --template seesharprun/monorepo-templates --branch <branch>`. This yields one template per `init` from a single repo, at the cost of managing branches.

## Prerequisites

- [Azure Developer CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd) (`azd`)
- An Azure subscription and `azd auth login` for `azd up`
- [Docker](https://www.docker.com/) for local builds of the `api` template (or rely on the configured ACR remote build)

## Provision and tear down

```powershell
azd -C web up      # provision + deploy
azd -C web down    # remove all resources
```
