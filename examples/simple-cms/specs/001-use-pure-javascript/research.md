# Research: Eshop CMS

## UIKit Integration

**Decision**: Use UIKit 3.x for UI components and responsive design.

**Rationale**: UIKit provides lightweight, modular CSS and JS components that align with the requirement for pure JavaScript/HTML/CSS without heavy frameworks. It supports admin-style interfaces with navigation, forms, and tables.

**Alternatives considered**: Bootstrap (heavier, more dependencies), Tailwind CSS (utility-first, but requires more custom JS), pure CSS (too time-consuming for consistent UI).

## API Integration

**Decision**: Use native fetch API for HTTP requests to the backend.

**Rationale**: Fetch is built-in to modern browsers, supports promises, and aligns with pure JavaScript requirement. No external libraries needed.

**Alternatives considered**: Axios (external library), XMLHttpRequest (older, less convenient).

## Authentication Handling

**Decision**: Assume manager is pre-authenticated; handle 401 errors by redirecting to login.

**Rationale**: The spec assumes logged-in manager; API likely handles auth via tokens or sessions.

**Alternatives considered**: Implement full auth flow (out of scope).

## Data Management

**Decision**: Use in-memory state for form data; fetch from API on load.

**Rationale**: Simple CRUD without complex state management libraries.

**Alternatives considered**: Redux or Vuex (external frameworks not allowed).

## Error Handling

**Decision**: Display user-friendly messages for API errors; retry on network failures.

**Rationale**: Improves UX as per requirements.

**Alternatives considered**: Silent failures, technical error messages.
