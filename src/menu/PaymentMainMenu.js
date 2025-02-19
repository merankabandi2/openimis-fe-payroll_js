/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ListAlt, AddCircleOutline } from '@material-ui/icons';
import { formatMessage, MainMenuContribution, withModulesManager } from '@openimis/fe-core';
import {
  PAYMENT_MAIN_MENU_CONTRIBUTION_KEY,
  MODULE_NAME,
  RIGHT_PAYROLL_CREATE,
  RIGHT_PAYROLL_SEARCH,
} from '../constants';

function PaymentMainMenu(props) {
  const ROUTE_PAYMENT_REQUEST = 'paymentrequest';
  const ROUTE_PAYMENT_NEW_PAYMENT = 'payroll/payroll';
  const entries = [
    {
      text: formatMessage(props.intl, MODULE_NAME, 'menu.payment.payments'),
      icon: <ListAlt />,
      route: `/${ROUTE_PAYMENT_REQUEST}`,
      filter: (rights) => rights.includes(RIGHT_PAYROLL_SEARCH),
    },
    {
      text: formatMessage(props.intl, MODULE_NAME, 'menu.paymentrequest.add'),
      icon: <AddCircleOutline />,
      route: `/${ROUTE_PAYMENT_NEW_PAYMENT}`,
      filter: (rights) => rights.includes(RIGHT_PAYROLL_CREATE),
    },
  ];
  entries.push(
    ...props.modulesManager
      .getContribs(PAYMENT_MAIN_MENU_CONTRIBUTION_KEY)
      .filter((c) => !c.filter || c.filter(props.rights)),
  );

  return (
    <MainMenuContribution
      {...props}
      header={formatMessage(props.intl, MODULE_NAME, 'mainMenuPayment')}
      entries={entries}
    />
  );
}

const mapStateToProps = (state) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
});

export default injectIntl(withModulesManager(connect(mapStateToProps)(PaymentMainMenu)));
