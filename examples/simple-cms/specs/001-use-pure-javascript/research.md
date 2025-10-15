# Research: Eshop CMS

## Feature Scope

**Decision**: CMS focuses on core CRUD operations for Products, Orders, and Users only.

**Rationale**: The spec explicitly defines this as a CMS for eshop management with three main user stories. Shop entity management is out-of-scope for this feature.

**Scope Boundaries**:
- IN-SCOPE: Product CRUD, Order view/update status, User CRUD
- OUT-OF-SCOPE: Shop management, complex relationships, advanced features

## UIKit Integration

**Decision**: Use UIKit 3.x for UI components and responsive design.

**Rationale**: UIKit provides lightweight, modular CSS and JS components that align with the requirement for pure JavaScript/HTML/CSS without heavy frameworks. It supports admin-style interfaces with navigation, forms, and tables as required by SC-014.

**Alternatives considered**: Bootstrap (heavier, more dependencies), Tailwind CSS (utility-first, but requires more custom JS), pure CSS (too time-consuming for consistent UI).

## API Integration

**Decision**: Use native fetch API for HTTP requests to the backend.

**Rationale**: Fetch is built-in to modern browsers, supports promises, and aligns with the pure JavaScript requirement (FR-015). Enables meeting performance criteria (SC-002, SC-003, SC-004, SC-005).

**Alternatives considered**: Axios (external library), XMLHttpRequest (older, less convenient).

## Navigation Structure

**Decision**: Sidebar navigation with collapsible menu for entity management sections.

**Rationale**: Required by FR-016 for consistent UI access to Products, Orders, and Users sections. UIKit provides suitable navigation components.

**Implementation**: Hash-based routing (#products, #orders, #users) with dynamic content loading.

## Authentication Handling

**Decision**: Assume manager is pre-authenticated; handle 401 errors by redirecting to login.

**Rationale**: The spec assumes logged-in manager context. Simplifies implementation while meeting error handling requirements.

**Alternatives considered**: Implement full auth flow (out of scope per research constraints).

## Data Management

**Decision**: Use in-memory state for form data; fetch from API on load.

**Rationale**: Simple CRUD operations don't require complex state management. Aligns with pure JavaScript constraint and meets performance goals.

**Alternatives considered**: Redux or Vuex (external frameworks not allowed per FR-015).

## Error Handling & UX

**Decision**: Display user-friendly messages for API errors with loading indicators and retry options.

**Rationale**: Required by FR-017 and SC-006 for responsive UI during loading. Supports SC-007 usability goals.

**Implementation**:
- Loading spinners during data fetching
- Error messages with retry buttons
- Network failure fallbacks to mock data in development

**Alternatives considered**: Silent failures, technical error messages.

## Performance Considerations

**Decision**: Optimize for sub-2 second load times and sub-5 second operations.

**Rationale**: Explicitly defined in success criteria (SC-002, SC-003, SC-004, SC-005). Native fetch API and simple data structures support these goals.

**Monitoring**: Jest test coverage ensures code quality and performance.

## Authentication Implementation

**Decision**: Session-based authentication with JWT tokens and automatic refresh.

**Rationale**: Provides secure, stateless authentication suitable for web-based CMS with good UX. Clarified during specification phase to ensure proper security handling.

**Implementation Details**:
- JWT tokens stored in localStorage with automatic cleanup on logout
- Automatic token refresh on expiration
- 401 responses trigger redirect to login
- Secure logout clears all stored tokens

**Alternatives considered**: Basic HTTP authentication (poor security), API key authentication (not suitable for user-based CMS), OAuth 2.0 (overkill for internal CMS).

## Data Relationships & Constraints

**Decision**: Foreign key relationships with referential integrity.

**Rationale**: Ensures data consistency and prevents orphaned records in the eshop system. Clarified during specification to define proper data integrity rules.

**Implementation**: Entity relationships defined with foreign key constraints as documented in data-model.md.

**Alternatives considered**: No explicit relationships (loose coupling), hierarchical relationships only.

## API Failure Scenarios

**Decision**: Handle network timeouts, server errors (5xx), and validation errors (4xx).

**Rationale**: Covers the most common API failure scenarios that impact user experience. Clarified to ensure robust error handling.

**Implementation**:
- Network timeouts with retry options
- Server errors with user guidance
- Validation errors with field-level messages

**Alternatives considered**: Only network failures, only server errors, all HTTP status codes.

## Concurrent Access Handling

**Decision**: Last-write-wins with optimistic locking.

**Rationale**: Simple, user-friendly approach for CMS where conflicts are rare. Clarified to ensure proper data consistency handling.

**Implementation**: Use updatedAt timestamps for optimistic locking with user feedback on operations.

**Alternatives considered**: Pessimistic locking (blocking), manual conflict resolution, version-based detection.

## Order Status Transitions

**Decision**: Enforce valid transitions: pending → processing → shipped → delivered.

**Rationale**: Represents standard e-commerce order fulfillment workflow. Clarified to ensure proper business logic implementation.

**Implementation**: Status transition validation in order update operations.

**Alternatives considered**: draft → confirmed → processing → completed, new → in_progress → fulfilled → cancelled.
