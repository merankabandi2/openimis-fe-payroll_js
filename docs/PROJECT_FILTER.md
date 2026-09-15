# Add a Project picker to the Payroll form

## What

`PayrollHeadPanel` now shows a Project multi-picker (create form and read-only
detail view) alongside the existing payment plan / payment point / payment
cycle fields. Selected projects are written to
`Payroll.jsonExt.filter_criteria.project_ids` and sent as-is by
`createPayroll` (no change to `actions.js` was needed: `formatPayrollGQL`
already forwards the whole `jsonExt` payload).

The picker reuses the existing published `socialProtection.ProjectPicker`
component, filtered only by the payroll's benefit plan (`benefitPlanId`); no
`status` filter is passed, so projects in any status remain selectable at
payroll-creation time. Upstream's own `FilterDialog` integration passes
`status="COMPLETED"` — adopt that constraint here too if payrolls should only
target completed projects. No new GraphQL query was added on the frontend;
`ProjectPicker` already queries:

```graphql
query ProjectPicker(
  $search: String, $first: Int, $benefitPlan_Id: ID, $status: ProjectStatus, $isDeleted: Boolean
) {
  project(
    name_Icontains: $search,
    first: $first,
    benefitPlan_Id: $benefitPlan_Id,
    status: $status,
    isDeleted: $isDeleted,
    orderBy: "name"
  ) {
    edges { node { id name status } }
  }
}
```

verified against `ProjectFilter` / `ProjectGQLType` in
`social_protection/gql_queries.py` (openimis-be-social_protection_py).

## Why this is not a dangling flag

`payroll/services.py` (`PayrollService`) and
`merankabandi/calcrule_strategies.py` already read
`json_ext.filter_criteria.project_ids` when building the beneficiary
selection for a payroll's benefit generation, and restrict it to
`project_enrollments__project__id__in=project_ids`. This change only adds the
missing UI for a filter the backend already applies — it was previously
settable only through the module's generic advanced-filter JSON editor.

## Fixed in passing

`PayrollHeadPanel.jsx` referenced `AdvancedFiltersDialog` without importing
it, and read `appliedCustomFilters` / `appliedFiltersRowStructure` from no
enclosing scope (`react/jsx-no-undef` and `no-undef` on all three, confirmed
with `npx eslint` before this change). Comparing against the pre-Vite-migration
version of the file (commit `b0773cf`, before `97cecad` "migrated from cra to
vite") shows the migration dropped the panel's constructor, state, and four
supporting methods without updating the JSX that still referenced them. Those
were restored (`updateJsonExt`, `getDefaultAppliedCustomFilters`,
`setAppliedCustomFilters`, `setAppliedFiltersRowStructure`, plus the
constructor/state), so the panel no longer carries undefined identifiers in
its render path.

## Files

- `src/components/payroll/PayrollHeadPanel.jsx`
- `src/translations/en.json`
- `src/translations/fr.json` (new)
- `src/index.jsx` (registers the French translations)
