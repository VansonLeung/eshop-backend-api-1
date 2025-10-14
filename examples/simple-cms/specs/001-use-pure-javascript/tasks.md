---
description: "Task list template for feature implementation"
---

# Tasks: Eshop CMS

**Input**: Design documents from `/specs/001-use-pure-javascript/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are MANDATORY per constitution - include comprehensive testing for all features.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- Paths: `src/`, `tests/` in workspace root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure: src/, tests/, index.html, styles.css, app.js
- [X] T002 Download and include UIKit CSS/JS in index.html
- [X] T003 Set up basic CSS with UIKit variables
- [X] T003.1 Set up automated testing framework (Jest) with coverage reporting

## Phase 2: Foundational (Prerequisites for All Stories)

**Purpose**: Core infrastructure needed before implementing user stories

- [X] T004 Create API client module in src/api.js for fetch requests
- [X] T005 Implement base HTML structure with sidebar navigation in index.html
- [X] T006 Create routing system in src/router.js for page navigation
- [X] T007 Set up error handling and loading indicators in src/ui.js

## Phase 3: Manage Products (US1 - P1)

**Purpose**: Implement CRUD for products
**Independent Test**: Can create, read, update, delete products independently

- [X] T008 Create product data model in src/models/product.js
- [X] T009 [P] [US1] Implement product list view in src/views/products/list.js
- [X] T010 [P] [US1] Implement product create form in src/views/products/create.js
- [X] T011 [P] [US1] Implement product edit form in src/views/products/edit.js
- [X] T012 [P] [US1] Implement product delete confirmation in src/views/products/delete.js
- [X] T013 [P] [US1] Create unit tests for product CRUD in tests/product.test.js
- [X] T014 Integrate product views into router

## Checkpoint: Product Management Complete
- Verify: Can perform all CRUD operations on products
- Test: Product list loads, create/edit/delete work

## Phase 4: Manage Orders (US2 - P2)

**Purpose**: Implement CRUD for orders
**Independent Test**: Can view and update order status independently

- [X] T015 Create order data model in src/models/order.js
- [X] T016 [P] [US2] Implement order list view in src/views/orders/list.js
- [X] T017 [P] [US2] Implement order detail view in src/views/orders/detail.js
- [X] T018 [P] [US2] Implement order status update in src/views/orders/update.js
- [X] T019 [P] [US2] Create unit tests for order operations in tests/order.test.js
- [X] T020 Integrate order views into router

## Checkpoint: Order Management Complete
- Verify: Can view orders and update status
- Test: Order list and updates work

## Phase 5: Manage Users (US3 - P3)

**Purpose**: Implement CRUD for users
**Independent Test**: Can create, read, update, delete users independently

- [X] T021 Create user data model in src/models/user.js
- [X] T022 [P] [US3] Implement user list view in src/views/users/list.js
- [X] T023 [P] [US3] Implement user create form in src/views/users/create.js
- [X] T024 [P] [US3] Implement user edit form in src/views/users/edit.js
- [X] T025 [P] [US3] Implement user delete confirmation in src/views/users/delete.js
- [X] T026 [P] [US3] Create unit tests for user CRUD in tests/user.test.js
- [X] T027 Integrate user views into router

## Checkpoint: User Management Complete
- Verify: Can perform all CRUD operations on users
- Test: User management works

## Final Phase: Polish & Integration

**Purpose**: Cross-cutting concerns and final integration

- [X] T028 Add responsive design improvements (aligns with SC-006: UI responsive during loading)
- [X] T029 Implement accessibility features (ARIA labels, keyboard navigation) (aligns with SC-007: 95% task completion)
- [X] T030 Add loading states and error handling across all views (aligns with SC-006: UI responsive during loading)
- [X] T031 Create comprehensive integration tests
- [X] T032 Performance optimization and final testing

## Dependencies

- US1 (Products) can be implemented independently
- US2 (Orders) depends on basic UI infrastructure from US1
- US3 (Users) can be implemented in parallel with US2 after US1

## Parallel Execution Examples

**Per Story**:
- US1: T009, T010, T011, T012 can run in parallel
- US2: T016, T017, T018 can run in parallel
- US3: T022, T023, T024, T025 can run in parallel

## Implementation Strategy

- **MVP**: Complete US1 (Product Management) for basic CRUD functionality
- **Increment 2**: Add US2 (Order Management)
- **Increment 3**: Add US3 (User Management)
- **Final**: Polish and integration testing

Each user story delivers a testable, valuable increment.
