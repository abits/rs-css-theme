# Spec Delta

## Purpose

Provides the retrosafe look as the first look of the package: its palette,
square corners and typography, with a designed dark mode, for retro-styled sites.

## ADDED Requirements

### Requirement: Light palette

In light mode the retrosafe look SHALL use this palette: background `#fefefe`, foreground `#1e1e1e`, accent `#f386a1` and accent-foreground `#1e1e1e`.

#### Scenario: Light mode colors

- **WHEN** the active mode is light
- **THEN** `bg-background` resolves to `#fefefe`, `text-foreground` to `#1e1e1e` and `bg-accent` to `#f386a1`

### Requirement: Dark mode is designed

In dark mode the retrosafe look SHALL use `#1e1e1e` as background and `#fefefe` as foreground and SHALL keep the accent hue. The look has no native dark mode, so these values are a design decision of this look.

#### Scenario: Dark mode colors

- **WHEN** the active mode is dark
- **THEN** `bg-background` resolves to `#1e1e1e` and `text-foreground` to `#fefefe`

### Requirement: Text contrast

Every text color pairing of the retrosafe look SHALL reach a contrast ratio of at least 4.5:1 in each mode. The pairings are foreground and muted on background, and accent-foreground on accent.

#### Scenario: Contrast check

- **WHEN** the contrast of each text pairing is computed for light mode and for dark mode
- **THEN** every ratio is at least 4.5:1

### Requirement: Square corners

The retrosafe look SHALL use no radius larger than 4px. The `sm` radius SHALL be 0.

#### Scenario: Radius values

- **WHEN** the radius utilities `rounded-sm`, `rounded-md` and `rounded-lg` are used
- **THEN** none of them renders a corner radius above 4px, and `rounded-sm` renders none

### Requirement: Free default fonts

The retrosafe look SHALL set `sans` to Inter and `mono` to JetBrains Mono. It SHALL NOT ship or reference a commercially licensed font.

#### Scenario: Font families

- **WHEN** `font-sans` and `font-mono` are used
- **THEN** they resolve to Inter and JetBrains Mono respectively, each with a generic fallback family
