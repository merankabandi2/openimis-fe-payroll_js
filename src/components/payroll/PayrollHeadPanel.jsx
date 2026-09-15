/* eslint-disable camelcase */
import React from 'react';
import { injectIntl } from 'react-intl';

import { Grid, Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  formatMessage,
  FormPanel,
  PublishedComponent,
  TextInput,
  withModulesManager,
  FormattedMessage,
  GRID_RESPONSIVE_STANDARD,
} from '@openimis/fe-core';
import AdvancedFiltersDialog from './AdvancedFiltersDialog';
import PayrollStatusPicker from './PayrollStatusPicker';
import PaymentMethodPicker from '../../pickers/PaymentMethodPicker';
import GenerationProgress from './GenerationProgress';
import { CLEARED_STATE_FILTER, PAYROLL_STATUS } from '../../constants';

// Parses jsonExt whether it arrives as a plain object or a (possibly double-encoded) JSON string.
const parseJsonExt = (jsonExt) => {
  try {
    let parsed = typeof jsonExt === 'string' ? JSON.parse(jsonExt) : (jsonExt ?? {});
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }
    return parsed ?? {};
  } catch (error) {
    return {};
  }
};

const StyledPayrollHeadPanel = styled('div')(({ theme }) => ({
  '& .tableTitle': theme.table?.title ?? {},
  '& .form': {
    padding: theme.spacing(1),
  },
  '& .item': {
    padding: theme.spacing(1),
    ...(theme.paper?.item ?? {}),
  },
  '& .fullHeight': {
    height: '100%',
  },
}));

class PayrollHeadPanel extends FormPanel {
  constructor(props) {
    super(props);
    this.state = {
      appliedCustomFilters: [CLEARED_STATE_FILTER],
      appliedFiltersRowStructure: [CLEARED_STATE_FILTER],
    };
  }

  componentDidMount() {
    const { edited } = this.props;
    const { jsonExt } = edited ?? {};
    if (jsonExt) {
      const filters = this.getDefaultAppliedCustomFilters(jsonExt);
      this.setState({ appliedCustomFilters: filters, appliedFiltersRowStructure: filters });
    }
  }

  updateJsonExt = (value) => {
    this.updateAttributes({ jsonExt: value });
  };

  // eslint-disable-next-line class-methods-use-this
  getDefaultAppliedCustomFilters = (jsonExt) => {
    const jsonData = parseJsonExt(jsonExt);
    const advancedCriteria = jsonData.advanced_criteria || [];
    return advancedCriteria.map(({ custom_filter_condition }) => {
      const [field, filter, typeValue] = custom_filter_condition.split('__');
      const [type, value] = typeValue.split('=');
      return {
        custom_filter_condition, field, filter, type, value,
      };
    });
  };

  setAppliedCustomFilters = (appliedCustomFilters) => {
    this.setState({ appliedCustomFilters });
  };

  setAppliedFiltersRowStructure = (appliedFiltersRowStructure) => {
    this.setState({ appliedFiltersRowStructure });
  };

  handleProjectsChange = (projects) => {
    const { edited } = this.props;
    const jsonData = parseJsonExt(edited?.jsonExt);
    const filterCriteria = { ...(jsonData.filter_criteria || {}) };
    if (projects && projects.length > 0) {
      filterCriteria.project_ids = projects.map((project) => project.id);
    } else {
      delete filterCriteria.project_ids;
    }
    if (Object.keys(filterCriteria).length > 0) {
      jsonData.filter_criteria = filterCriteria;
    } else {
      delete jsonData.filter_criteria;
    }
    this.updateJsonExt(JSON.stringify(jsonData));
  };

  render() {
    const {
      edited, intl, readOnly, isPayrollFromFailedInvoices, benefitPlanId,
    } = this.props;
    const { appliedFiltersRowStructure } = this.state;
    const payroll = { ...edited };

    let effectiveBenefitPlanId = benefitPlanId;
    if (!effectiveBenefitPlanId && payroll?.paymentPlan?.benefitPlan) {
      const benefitPlan = JSON.parse(payroll.paymentPlan.benefitPlan);
      if (benefitPlan) {
        effectiveBenefitPlanId = JSON.parse(benefitPlan)?.id;
      }
    }
    const selectedProjects = (parseJsonExt(payroll.jsonExt).filter_criteria?.project_ids || [])
      .map((id) => ({ id }));
    return (
      <StyledPayrollHeadPanel>
        <Grid container className="form">
          <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
            <TextInput
              module="payroll"
              label="paymentPoint.name"
              value={payroll?.name}
              required
              onChange={(name) => this.updateAttribute('name', name)}
              readOnly={isPayrollFromFailedInvoices ? !isPayrollFromFailedInvoices : readOnly}
            />
          </Grid>
          <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
            <PublishedComponent
              pubRef="contributionPlan.PaymentPlanPicker"
              required
              filterLabels={false}
              onChange={(paymentPlan) => this.updateAttribute('paymentPlan', paymentPlan)}
              value={payroll?.paymentPlan}
              readOnly={readOnly}
              benefitPlanId={effectiveBenefitPlanId}
            />
          </Grid>
          <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
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
          <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
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
            <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
              <PayrollStatusPicker
                required
                withNull={false}
                readOnly={readOnly}
                value={!!payroll?.status && payroll.status}
              />
            </Grid>
          )}
          <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
            <PaymentMethodPicker
              required
              withNull={false}
              readOnly={readOnly}
              value={!!payroll?.paymentMethod && payroll.paymentMethod}
              onChange={(paymentMethod) => this.updateAttribute('paymentMethod', paymentMethod)}
              label={formatMessage(intl, 'payroll', 'paymentMethod')}
            />
          </Grid>
          <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
            <PublishedComponent
              pubRef="core.DatePicker"
              module="payroll"
              label="payroll.dateValidFrom"
              required
              value={payroll.dateValidFrom ? payroll.dateValidFrom : null}
              onChange={(v) => this.updateAttribute('dateValidFrom', v)}
              readOnly={readOnly}
            />
          </Grid>
          <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
            <PublishedComponent
              pubRef="core.DatePicker"
              module="payroll"
              label="payroll.dateValidTo"
              required
              value={payroll.dateValidTo ? payroll.dateValidTo : null}
              onChange={(v) => this.updateAttribute('dateValidTo', v)}
              readOnly={readOnly}
            />
          </Grid>
          {!isPayrollFromFailedInvoices && (
            <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
              <PublishedComponent
                pubRef="socialProtection.ProjectPicker"
                benefitPlanId={effectiveBenefitPlanId}
                multiple
                withLabel
                label={formatMessage(intl, 'payroll', 'payroll.projects')}
                withPlaceholder
                placeholder={formatMessage(intl, 'payroll', 'payroll.projects.placeholder')}
                value={selectedProjects}
                onChange={this.handleProjectsChange}
                readOnly={readOnly}
              />
            </Grid>
          )}
        </Grid>
        {payroll?.status === PAYROLL_STATUS.GENERATING && (
          <div className="item">
            <GenerationProgress jsonExt={payroll.jsonExt} />
          </div>
        )}
        <Divider />
        {!isPayrollFromFailedInvoices
          && (
            <>
              <>
                <Typography>
                  <div className="item">
                    <FormattedMessage module="contributionPlan" id="paymentPlan.advancedCriteria" />
                  </div>
                </Typography>
                {!readOnly && (
                  <div className="item">
                    <FormattedMessage module="contributionPlan" id="paymentPlan.advancedCriteria.tip" />
                  </div>
                )}
                <Divider />
                <Grid container className="form">

                  <AdvancedFiltersDialog
                    object={payroll?.paymentPlan?.benefitPlan
                      ? JSON.parse(JSON.parse(payroll.paymentPlan.benefitPlan))
                      : null}
                    objectToSave={payroll}
                    moduleName="social_protection"
                    objectType="BenefitPlan"
                    setAppliedCustomFilters={this.setAppliedCustomFilters}
                    appliedFiltersRowStructure={appliedFiltersRowStructure}
                    setAppliedFiltersRowStructure={this.setAppliedFiltersRowStructure}
                    updateAttributes={this.updateJsonExt}
                    getDefaultAppliedCustomFilters={() => this.getDefaultAppliedCustomFilters(payroll.jsonExt)}
                    readOnly={readOnly}
                    edited={edited}
                  />

                </Grid>
              </>
              <Divider />
            </>
          )}
      </StyledPayrollHeadPanel>
    );
  }
}

export { StyledPayrollHeadPanel };
export default withModulesManager(injectIntl(PayrollHeadPanel));
