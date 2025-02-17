/* eslint-disable camelcase */
import React from 'react';
import { injectIntl } from 'react-intl';

import { Grid, Divider } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';

import {
  FormPanel,
  PublishedComponent,
  withModulesManager,
} from '@openimis/fe-core';
import PaymentVerifyApproveForPayment from './dialogs/PaymentVerifyApproveForPayment';
import { CLEARED_STATE_FILTER } from '../../constants';
import PayrollStatusPicker from './PayrollStatusPicker';

const styles = (theme) => ({
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: '100%',
  },
});

class PayrollHeadPanel extends FormPanel {
  constructor(props) {
    super(props);
    this.state = {
      appliedCustomFilters: [CLEARED_STATE_FILTER],
      appliedFiltersRowStructure: [CLEARED_STATE_FILTER],
    };
  }

  componentDidMount() {
    this.setStateFromProps(this.props);
  }

  setStateFromProps = (props) => {
    const { jsonExt } = props?.edited ?? {};
    if (jsonExt) {
      const filters = this.getDefaultAppliedCustomFilters(jsonExt);
      this.setState({ appliedCustomFilters: filters, appliedFiltersRowStructure: filters });
    }
  };

  updateJsonExt = (value) => {
    this.updateAttributes({
      jsonExt: value,
    });
  };

  // eslint-disable-next-line class-methods-use-this
  getDefaultAppliedCustomFilters = (jsonExt) => {
    try {
      const jsonData = JSON.parse(jsonExt);
      const advancedCriteria = jsonData.advanced_criteria || [];
      const transformedCriteria = advancedCriteria.map(({ custom_filter_condition }) => {
        const [field, filter, typeValue] = custom_filter_condition.split('__');
        const [type, value] = typeValue.split('=');
        return {
          custom_filter_condition,
          field,
          filter,
          type,
          value,
        };
      });
      return transformedCriteria;
    } catch (error) {
      return [];
    }
  };

  setAppliedCustomFilters = (appliedCustomFilters) => {
    this.setState({ appliedCustomFilters });
  };

  setAppliedFiltersRowStructure = (appliedFiltersRowStructure) => {
    this.setState({ appliedFiltersRowStructure });
  };

  render() {
    const {
      edited, classes, readOnly, isPayrollFromFailedInvoices, benefitPlanId, user, task,
    } = this.props;
    const payroll = { ...edited };

    return (
      <>
        <Grid container className={classes.item}>
          <Grid xs={12}>
            <PublishedComponent
              pubRef="location.CommuneLocation"
              withNull
              required
              readOnly={readOnly}
              filterLabels={false}
              value={payroll?.location}
              onChange={(locations) => this.updateAttribute('location', locations)}
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <PublishedComponent
              pubRef="contributionPlan.PaymentPlanPicker"
              required
              filterLabels={false}
              onChange={(paymentPlan) => this.updateAttribute('paymentPlan', paymentPlan)}
              value={payroll?.paymentPlan}
              readOnly={readOnly}
              benefitPlanId={benefitPlanId}
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <PublishedComponent
              pubRef="payroll.PaymentPointPicker"
              withLabel
              withPlaceholder
              filterLabels={false}
              onChange={(paymentPoint) => this.updateAttribute('paymentPoint', paymentPoint)}
              value={payroll?.paymentPoint}
              readOnly={readOnly}
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <PublishedComponent
              pubRef="paymentCycle.PaymentCyclePicker"
              withLabel
              required
              withPlaceholder
              filterLabels={false}
              onChange={(paymentCycle) => this.updateAttribute('paymentCycle', paymentCycle)}
              value={payroll?.paymentCycle}
              readOnly={isPayrollFromFailedInvoices ? !isPayrollFromFailedInvoices : readOnly}
            />
          </Grid>
          {readOnly && !isPayrollFromFailedInvoices && (
          <Grid item xs={3} className={classes.item}>
            <PayrollStatusPicker
              required
              withNull={false}
              readOnly={readOnly}
              value={!!payroll?.status && payroll.status}
            />
          </Grid>
          )}
          <Grid item xs={3} className={classes.item}>
            <PublishedComponent
              pubRef="core.DatePicker"
              module="payroll"
              label="dateValidFrom"
              required
              value={payroll.dateValidFrom ? payroll.dateValidFrom : null}
              onChange={(v) => this.updateAttribute('dateValidFrom', v)}
              readOnly={readOnly}
            />
          </Grid>
          <Grid item xs={12} className={classes.item}>
            <div style={{
              float: 'right',
              paddingRight: '16px',
            }}
            >
              <PaymentVerifyApproveForPayment
                classes={classes}
                payrollDetail={payroll}
                task={task}
                user={user}
              />
            </div>
          </Grid>
        </Grid>
        <Divider />
      </>
    );
  }
}

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(PayrollHeadPanel))));
