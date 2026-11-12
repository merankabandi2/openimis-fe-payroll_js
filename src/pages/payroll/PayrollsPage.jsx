import React from 'react';
import { useSelector } from 'react-redux';

import { Fab } from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  Helmet,
  useModulesManager,
  useTranslations,
  useHistory,
  withTooltip,
  GetIconComponent,
  overridable,
} from '@openimis/fe-core';
import {
  MODULE_NAME,
  PAYROLL_PAYROLL_ROUTE,
  RIGHT_PAYROLL_CREATE,
  RIGHT_PAYROLL_SEARCH,
} from '../../constants';
import PayrollSearcher from '../../components/payroll/PayrollSearcher';
const AddIcon = GetIconComponent("Add");

const StyledPayrollsPage = styled('div')(({ theme }) => ({
  '&.page': theme.page ?? {},
  '& .fab': theme.fab ?? {},
}));

function PayrollsPage() {
  const modulesManager = useModulesManager();
  const history = useHistory();
  const rights = useSelector((store) => store.core.user.i_user.rights ?? []);
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);

  const onCreate = () => history.push(
    `/${modulesManager.getRef(PAYROLL_PAYROLL_ROUTE)}`,
  );

  return (
    <StyledPayrollsPage className="page">
      <Helmet title={formatMessage('paymentPoint.page.title')} />
      {rights.includes(RIGHT_PAYROLL_SEARCH)
        && <PayrollSearcher />}
      {rights.includes(RIGHT_PAYROLL_CREATE)
        && withTooltip(
          <div className="fab">
            <Fab color="primary" onClick={onCreate}>
              <AddIcon />
            </Fab>
          </div>,
          formatMessage('createButton.tooltip'),
        )}
    </StyledPayrollsPage>
  );
}

export default overridable('payroll.PayrollsPage')(PayrollsPage);
