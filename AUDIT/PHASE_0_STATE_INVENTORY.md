# PHASE 0: STATE FORENSIC AUDIT

## State Inventory

| State Name | File | Type | Owner | Consumers | Persistence | Route Relationship | Should Remain? | Should Eventually Migrate? | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| `AuthContext` (`user`, `role`) | `src/context/AuthContext.tsx` | GLOBAL_STATE | Context Provider | `AppShell`, `Header`, `AuthModal` | LocalStorage (`eb_access_token`) | Independent | Yes | No | Context hooks used across UI |
| `activeTab` | `src/components/AppShell.tsx` | ROUTE_STATE | React Router | `AppShell` (derive active route) | None (URL) | Tied to `location.pathname` | Yes (as route) | No | Converted to router in Phase 2 |
| `currentLessonIndex` | `src/components/AppShell.tsx` | UI_LOCAL_STATE | `AppShell` | `LessonViewer`, `SidebarDrawer` | None | Disconnected (Prop Drill) | No | Yes (to URL Params) | Passed down as prop |
| `selectedUnit` | `src/components/AppShell.tsx` | UI_LOCAL_STATE | `AppShell` | `SidebarDrawer`, `UnitMapAndOutcomes` | None | Disconnected (Prop Drill) | No | Yes (to URL Params) | Passed down as prop |
| `is[Modal]Open` | `src/components/AppShell.tsx` | UI_LOCAL_STATE | `AppShell` | Various Modals | None | None | Yes | No (Local state fine) | Modal toggles |
| `completedExercisesCount` | `src/components/AppShell.tsx` | LEGACY_COMPATIBILITY_STATE | `AppShell` | `Header` | LocalStorage | None | No | Yes (to DB Progress) | `localStorage.getItem('eb_acc_progress')` |

**Conclusion**: Core navigation state (`activeTab`) has been migrated to the URL. However, entity-specific state (`currentLessonIndex`, `selectedUnit`) is still managed via React `useState` at the root `AppShell` and prop-drilled down, rather than extracted from URL parameters (`useParams`). This is documented as a necessary refactoring for Phase 3.

