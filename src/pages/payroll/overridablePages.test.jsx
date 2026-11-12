/* eslint-disable import/no-extraneous-dependencies -- Vitest runs from the frontend assembly */
import { describe, expect, it, vi } from 'vitest';
import PayrollPage from './PayrollPage';
import PayrollsPage from './PayrollsPage';
import ApprovedPayrollsPage from './ApprovedPayrollsPage';
import PendingPayrollsPage from './PendingPayrollsPage';
import ReconciledPayrollsPage from './ReconciledPayrollsPage';
import { PayrollModule } from '../../index';
import { PayrollTaskItemFormatters } from '../../components/tasks/PayrollTasks';

// fe-core `overridable(key)` stand-in: tags the wrapper with its key. The other fe-core exports
// the payroll sources reach at load time are inert: callable, extendable, returning themselves.
vi.mock('@openimis/fe-core', () => {
  function inert() {
    return inert;
  }
  const exports = Object.fromEntries([
    'Autocomplete',
    'ConstantBasedPicker',
    'Contributions',
    'ControlledField',
    'CustomFilterFieldStatusPicker',
    'CustomFilterTypeStatusPicker',
    'Form',
    'FormPanel',
    'FormattedMessage',
    'GRID_RESPONSIVE_SMALL',
    'GRID_RESPONSIVE_STANDARD',
    'GetIconComponent',
    'Helmet',
    'NumberInput',
    'PublishedComponent',
    'Searcher',
    'SelectInput',
    'TextInput',
    'apiHeaders',
    'baseApiUrl',
    'coreConfirm',
    'createFieldsBasedOnJSON',
    'decodeId',
    'dispatchMutationErr',
    'dispatchMutationReq',
    'dispatchMutationResp',
    'fetchCustomFilter',
    'formatGQLString',
    'formatGraphQLError',
    'formatMessage',
    'formatMutation',
    'formatPageQueryWithCount',
    'formatQuery',
    'formatServerError',
    'graphql',
    'journalize',
    'pageInfo',
    'parseData',
    'renderInputComponent',
    'useGraphqlQuery',
    'useHistory',
    'useModulesManager',
    'useTranslations',
    'withModulesManager',
    'withTooltip',
  ].map((name) => [name, inert]));
  exports.overridable = (key) => (Component) => {
    const Wrapper = () => null;
    Wrapper.overridableKey = key;
    Wrapper.wrapped = Component;
    return Wrapper;
  };
  return exports;
});

describe('overridable payroll pages', () => {
  it.each([
    ['PayrollPage', PayrollPage],
    ['PayrollsPage', PayrollsPage],
    ['ApprovedPayrollsPage', ApprovedPayrollsPage],
    ['PendingPayrollsPage', PendingPayrollsPage],
    ['ReconciledPayrollsPage', ReconciledPayrollsPage],
  ])('exports %s through overridable("payroll.%s")', (page, component) => {
    expect(component.overridableKey).toBe(`payroll.${page}`);
  });

  it('renders the overridable pages from the payroll routes', () => {
    const routes = PayrollModule({})['core.Router'];
    const keyOf = (pathStart) => routes.find((route) => route.path.startsWith(pathStart)).component.overridableKey;

    expect(keyOf('payrolls/payroll/')).toBe('payroll.PayrollPage');
    expect(keyOf('payrollsApproved')).toBe('payroll.ApprovedPayrollsPage');
    expect(keyOf('payrollsPending')).toBe('payroll.PendingPayrollsPage');
    expect(keyOf('payrollsReconciled')).toBe('payroll.ReconciledPayrollsPage');
    expect(routes.find((route) => route.path === 'payrolls').component.overridableKey).toBe('payroll.PayrollsPage');
  });

  it('renders the overridable payroll page in the payroll task view', () => {
    const element = PayrollTaskItemFormatters()[0]({ id: 'payroll-uuid' });

    expect(element.type.overridableKey).toBe('payroll.PayrollPage');
    expect(element.props.taskPayrollUuid).toBe('payroll-uuid');
  });
});
