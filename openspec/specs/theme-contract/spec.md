# theme-contract Specification

## Purpose

Defines the token contract that every look implements, how a site swaps one
look for another, and how light and dark mode are selected, so that one
package works across Vue, React, AlpineJS, Nuxt and Next.

## Requirements

### Requirement: Complete token set

A look SHALL define every token of the contract in both light and dark mode. The initial contract has the colors `background`, `foreground`, `muted`, `border`, `accent` and `accent-foreground`, the radii `sm`, `md` and `lg`, and the font families `sans` and `mono`. Each token is usable through the matching Tailwind v4 utility, for example `bg-background`, `rounded-md` or `font-mono`. Adding a token is compatible; renaming or removing one is breaking.

#### Scenario: Complete look

- **WHEN** a look defines all contract tokens for both modes
- **THEN** the contract check accepts the look

#### Scenario: Missing token

- **WHEN** a look omits one contract token
- **THEN** the contract check rejects the look and names the missing token

### Requirement: Look is swappable through one import

A site SHALL switch from one look to another by changing a single CSS import. The switch SHALL NOT require changes to markup, components or build configuration, beyond the one-time host setting of the requirement "Host CSS target".

#### Scenario: Swap the look

- **WHEN** a site replaces the import of one look with the import of another look
- **THEN** all contract utilities in that site resolve to the values of the new look

### Requirement: Host CSS target

The host's CSS build SHALL target at least Chrome 123, Firefox 120 and Safari 17.5, the first versions with `light-dark()`. The package SHALL document the setting for each supported host, because a host that targets older browsers rewrites `light-dark()` into a fallback that renders no colors.

#### Scenario: Host with a raised CSS target

- **WHEN** the host's CSS build targets at least Chrome 123, Firefox 120 and Safari 17.5
- **THEN** the built CSS keeps `light-dark()` and the contract color utilities resolve in light and dark mode

#### Scenario: Host with the default CSS target of an older release

- **WHEN** the host's CSS build targets older browsers than the baseline
- **THEN** the configuration is unsupported, and the README names the setting that fixes it

### Requirement: Mode follows color-scheme

A look SHALL define mode-dependent colors with `light-dark()`, so that the active mode follows the `color-scheme` of the host. The package SHALL NOT define its own mode selectors, class names or media queries for the mode.

#### Scenario: Host forces dark

- **WHEN** the host sets `color-scheme: dark` on the document root
- **THEN** contract color utilities resolve to the dark values

#### Scenario: Host forces light

- **WHEN** the host sets `color-scheme: light` on the document root
- **THEN** contract color utilities resolve to the light values

#### Scenario: Host follows the system

- **WHEN** the host sets `color-scheme: light dark` and the system prefers dark
- **THEN** contract color utilities resolve to the dark values

### Requirement: Plain CSS only

The package SHALL consist of CSS files only. It SHALL NOT require a script, a plugin or a framework dependency in the host beyond Tailwind v4.

#### Scenario: Installing the package

- **WHEN** a site adds the package and imports a look
- **THEN** no JavaScript from the package runs in the browser

### Requirement: Supported hosts

The package SHALL work with Tailwind v4 in Vue, React, AlpineJS, Nuxt and Next projects.

#### Scenario: Import in a supported host

- **WHEN** a project of any supported host imports a look in its Tailwind v4 entry stylesheet
- **THEN** the contract utilities resolve to the look's values in that project

### Requirement: Evergreen browsers only

The package SHALL target browsers that support `light-dark()`. It SHALL NOT provide a fallback for older browsers.

#### Scenario: Browser without light-dark support

- **WHEN** a browser does not support `light-dark()`
- **THEN** no rendering of the look is guaranteed
