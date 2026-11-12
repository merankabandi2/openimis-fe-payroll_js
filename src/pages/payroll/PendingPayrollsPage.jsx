import React from 'react';
import { useSelector } from 'react-redux';

import { styled } from '@mui/material/styles';

import {
  Helmet,
  useModulesManager,
  useTranslations,
  overridable,
} from '@openimis/fe-core';
import {
  MODULE_NAME,
  RIGHT_PAYROLL_SEARCH,
} from '../../constants';
import PayrollSearcherPending from '../../components/payroll/PayrollSearcherPending';

const StyledPendingPayrollsPage = styled('div')(({ theme }) => ({
  '&.page': theme.page ?? {},
  '& .fab': theme.fab ?? {},
}));

function PendingPayrollsPage() {
  const modulesManager = useModulesManager();
  const rights = useSelector((store) => store.core.user.i_user.rights ?? []);
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);

  return (
    <StyledPendingPayrollsPage className="page">
      <Helmet title={formatMessage('paymentPoint.page.title')} />
      {rights.includes(RIGHT_PAYROLL_SEARCH)
        && <PayrollSearcherPending />}
    </StyledPendingPayrollsPage>
  );
}

export default overridable('payroll.PendingPayrollsPage')(PendingPayrollsPage);
