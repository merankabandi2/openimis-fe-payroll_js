/* eslint-disable import/prefer-default-export */
/* eslint-disable camelcase */

import React from 'react';

import { PinDrop, ListAlt, AddCircleOutline } from '@material-ui/icons';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

import { FormattedMessage } from '@openimis/fe-core';
import {
  RIGHT_PAYMENT_POINT_SEARCH,
  RIGHT_PAYROLL_CREATE,
  RIGHT_PAYROLL_SEARCH,
  ROUTE_PAYMENT_REQUEST,
  ROUTE_PAYMENT_NEW_PAYMENT,
} from './constants';
import reducer from './reducer';
import PaymentMainMenu from './menu/PaymentMainMenu';
import messages_en from './translations/en.json';
import PaymentPointPage from './pages/payment-point/PaymentPointPage';
import PaymentPointsPage from './pages/payment-point/PaymentPointsPage';
import PayrollPage from './pages/payroll/PayrollPage';
import PaymentRequestPage from './pages/payroll/PaymentRequestPage';
import PayrollsPage from './pages/payroll/PayrollsPage';
import ApprovedPayrollsPage from './pages/payroll/ApprovedPayrollsPage';
import ReconciledPayrollsPage from './pages/payroll/ReconciledPayrollsPage';
import PaymentPointPicker from './components/payment-point/PaymentPointPicker';
import BenefitConsumptionPayrollSearcher from './components/payroll/BenefitConsumptionPayrollSearcher';
import {
  PayrollTaskItemFormatters,
  PayrollTaskTableHeaders,
} from './components/tasks/PayrollTasks';
import {
  PayrollReconciliationTaskItemFormatters,
  PayrollReconciliationTaskTableHeaders,
} from './components/tasks/PayrollReconciliationTasks';
import {
  BenefitConsumptionsTabLabel,
  BenefitConsumptionsTabPanel,
} from './components/payroll/BenefitConsumptionTabPanel';
import {
  PaymentRequestAllTabLabel,
  PaymentRequestAllTabPanel,
} from './components/payroll/PaymentRequestAllTabPanel';
import {
  PaymentRequestToValidateTabLabel,
  PaymentRequestToValidateTabPanel,
} from './components/payroll/PaymentRequestToValidateTabPanel';
import {
  PaymentRequestToVerifyTabLabel,
  PaymentRequestToVerifyTabPanel,
} from './components/payroll/PaymentRequestToVerifyTabPanel';
import {
  PaymentRequestReconciliatedTabLabel,
  PaymentRequestReconciliatedTabPanel,
} from './components/payroll/PaymentRequestReconciliatedTabPanel';
import {
  PaymentRequestRejectedTabLabel,
  PaymentRequestRejectedTabPanel,
} from './components/payroll/PaymentRequestRejectedTabPanel';
import {
  PayrollRejectedTaskItemFormatters,
  PayrollRejectedTaskTableHeaders,
} from './components/tasks/PayrollRejectedTasks';
import {
  PayrollTaskTabLabel,
  PayrollTaskTabPanel,
} from './components/payroll/PayrollTaskTabPanel';
import { PayrollDeleteTaskItemFormatters, PayrollDeleteTaskTableHeaders } from './components/tasks/PayrollDeleteTasks';
import { PayrollPaymentFilesTabLabel, PayrollPaymentFilesTabPanel } from './components/payroll/PayrollPaymentFilesTab';
import PendingPayrollsPage from './pages/payroll/PendingPayrollsPage';

const ROUTE_PAYMENT_POINTS = 'paymentPoints';
const ROUTE_PAYMENT_POINT = 'paymentPoints/paymentPoint';
const ROUTE_PAYROLLS = 'payrolls';
const ROUTE_PAYROLLS_APPROVED = 'payrollsApproved';
const ROUTE_PAYROLLS_PENDING = 'payrollsPending';
const ROUTE_PAYROLLS_RECONCILED = 'payrollsReconciled';
const ROUTE_PAYROLL = 'payrolls/payroll';
const ROUTE_PAYMENTREQUEST = 'paymentrequest';
const MODULE_NAME = 'payroll';

const DEFAULT_CONFIG = {
  translations: [{ key: 'en', messages: messages_en }],
  reducers: [{ key: 'payroll', reducer }],
  refs: [
    { key: 'payroll.route.paymentPoints', ref: ROUTE_PAYMENT_POINTS },
    { key: 'payroll.route.paymentPoint', ref: ROUTE_PAYMENT_POINT },
    { key: 'payroll.route.payrolls', ref: ROUTE_PAYROLLS },
    { key: 'payroll.route.payrollsApproved', ref: ROUTE_PAYROLLS_APPROVED },
    { key: 'payroll.route.payrollsPending', ref: ROUTE_PAYROLLS_PENDING },
    { key: 'payroll.route.payrollsReconciled', ref: ROUTE_PAYROLLS_RECONCILED },
    { key: 'payroll.route.payroll', ref: ROUTE_PAYROLL },
    { key: 'payroll.PaymentPointPicker', ref: PaymentPointPicker },
    { key: 'payroll.PaymentPointPicker.projection', ref: ['id', 'name', 'location'] },
    { key: 'payroll.benefitConsumptionPayrollSearcher', ref: BenefitConsumptionPayrollSearcher },
    { key: 'payroll.payrollCreateRight', ref: RIGHT_PAYROLL_CREATE },
  ],
  'core.Router': [
    { path: ROUTE_PAYMENT_POINTS, component: PaymentPointsPage },
    { path: `${ROUTE_PAYMENT_POINT}/:payment_point_uuid?`, component: PaymentPointPage },
    { path: ROUTE_PAYROLLS, component: PayrollsPage },
    { path: ROUTE_PAYROLLS_APPROVED, component: ApprovedPayrollsPage },
    { path: ROUTE_PAYROLLS_PENDING, component: PendingPayrollsPage },
    { path: ROUTE_PAYROLLS_RECONCILED, component: ReconciledPayrollsPage },
    {
      path: `${ROUTE_PAYROLL}/:payroll_uuid?/:createPayrollFromFailedInvoices?/:benefitPlanId?`,
      component: PayrollPage,
    },
    { path: ROUTE_PAYMENTREQUEST, component: PaymentRequestPage },
  ],
  'invoice.MainMenu': [
    {
      text: <FormattedMessage module="payroll" id="payroll.paymentPoint.route" />,
      icon: <PinDrop />,
      route: `/${ROUTE_PAYMENT_POINTS}`,
      filter: (rights) => rights.includes(RIGHT_PAYMENT_POINT_SEARCH),
      id: 'legalAndFinance.paymentPoint',
    },
    {
      text: <FormattedMessage module="payroll" id="payroll.payroll.route" />,
      icon: <MonetizationOnIcon />,
      route: `/${ROUTE_PAYROLLS}`,
      filter: (rights) => rights.includes(RIGHT_PAYROLL_SEARCH),
      id: 'legalAndFinance.payrolls',
    },
    {
      text: <FormattedMessage module="payroll" id="payroll.route.payrollsPending" />,
      icon: <MonetizationOnIcon />,
      route: `/${ROUTE_PAYROLLS_PENDING}`,
      filter: (rights) => rights.includes(RIGHT_PAYROLL_SEARCH),
      id: 'legalAndFinance.payrollsPending',
    },
    {
      text: <FormattedMessage module="payroll" id="payroll.route.payrollsApproved" />,
      icon: <MonetizationOnIcon />,
      route: `/${ROUTE_PAYROLLS_APPROVED}`,
      filter: (rights) => rights.includes(RIGHT_PAYROLL_SEARCH),
      id: 'legalAndFinance.payrollsApproved',
    },
    {
      text: <FormattedMessage module="payroll" id="payroll.route.payrollsReconciled" />,
      icon: <MonetizationOnIcon />,
      route: `/${ROUTE_PAYROLLS_RECONCILED}`,
      filter: (rights) => rights.includes(RIGHT_PAYROLL_SEARCH),
      id: 'legalAndFinance.payrollsReconciled',
    },
  ],
  'paymentrequest.MainMenu': [
    {
      text: <FormattedMessage module={MODULE_NAME} id="menu.payment.payments" />,
      icon: <ListAlt />,
      route: `/${ROUTE_PAYMENT_REQUEST}`,
      filter: (rights) => rights.includes(RIGHT_PAYROLL_SEARCH),
      id: 'payroll.paymentrequests',
    },
    {
      text: <FormattedMessage module={MODULE_NAME} id="menu.paymentrequest.add" />,
      icon: <AddCircleOutline />,
      route: `/${ROUTE_PAYMENT_NEW_PAYMENT}`,
      filter: (rights) => rights.includes(RIGHT_PAYROLL_CREATE),
      id: 'payroll.paymentrequest.add',
    },
  ],
  'core.MainMenu': [PaymentMainMenu],
  'payroll.TabPanel.label': [BenefitConsumptionsTabLabel, PayrollTaskTabLabel, PayrollPaymentFilesTabLabel],
  'payroll.TabPanel.panel': [
    BenefitConsumptionsTabPanel,
    PayrollTaskTabPanel,
    PayrollPaymentFilesTabPanel,
  ],
  'paymentRequest.TabPanel.label': [
    PaymentRequestAllTabLabel,
    PaymentRequestToVerifyTabLabel,
    PaymentRequestToValidateTabLabel,
    PaymentRequestReconciliatedTabLabel,
    PaymentRequestRejectedTabLabel,
  ],
  'paymentRequest.TabPanel.panel': [
    PaymentRequestAllTabPanel,
    PaymentRequestToVerifyTabPanel,
    PaymentRequestToValidateTabPanel,
    PaymentRequestReconciliatedTabPanel,
    PaymentRequestRejectedTabPanel,
  ],
  'tasksManagement.tasks': [{
    text: <FormattedMessage module="payroll" id="payroll.tasks.update.title" />,
    tableHeaders: PayrollTaskTableHeaders,
    itemFormatters: PayrollTaskItemFormatters,
    taskSource: ['payroll'],
  },
  {
    text: <FormattedMessage module="payroll" id="payroll.tasks.verify.title" />,
    tableHeaders: PayrollTaskTableHeaders,
    itemFormatters: PayrollTaskItemFormatters,
    taskSource: ['payroll_verification'],
  },
  {
    text: <FormattedMessage module="payroll" id="payroll.tasks.reconciliation.title" />,
    tableHeaders: PayrollReconciliationTaskTableHeaders,
    itemFormatters: PayrollReconciliationTaskItemFormatters,
    taskSource: ['payroll_reconciliation'],
  },
  {
    text: <FormattedMessage module="payroll" id="payroll.tasks.rejected.title" />,
    tableHeaders: PayrollRejectedTaskTableHeaders,
    itemFormatters: PayrollRejectedTaskItemFormatters,
    taskSource: ['payroll_reject'],
  },
  {
    text: <FormattedMessage module="payroll" id="payroll.tasks.delete.title" />,
    tableHeaders: PayrollDeleteTaskTableHeaders,
    itemFormatters: PayrollDeleteTaskItemFormatters,
    taskSource: ['payroll_delete'],
  }],
};

export const PayrollModule = (cfg) => ({ ...DEFAULT_CONFIG, ...cfg });
