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
import PayrollSearcherApproved from '../../components/payroll/PayrollSearcherApproved';

const StyledApprovedPayrollsPage = styled('div')(({ theme }) => ({
  '&.page': theme.page ?? {},
  '& .fab': theme.fab ?? {},
}));

function ApprovedPayrollsPage() {
  const modulesManager = useModulesManager();
  const rights = useSelector((store) => store.core.user.i_user.rights ?? []);
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);

  return (
    <StyledApprovedPayrollsPage className="page">
      <Helmet title={formatMessage('paymentPoint.page.title')} />
      {rights.includes(RIGHT_PAYROLL_SEARCH)
        && <PayrollSearcherApproved />}
    </StyledApprovedPayrollsPage>
  );
}

export default overridable('payroll.ApprovedPayrollsPage')(ApprovedPayrollsPage);
