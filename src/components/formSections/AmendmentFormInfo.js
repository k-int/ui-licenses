import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Checkbox,
  Col,
  Datepicker,
  Row,
  Select,
  TextArea,
  TextField,
} from '@folio/stripes/components';

import { required } from '../../util/validators';

class AmendmentFormInfo extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      statusValues: PropTypes.array,
      typeValues: PropTypes.array,
    }),
  };

  state = {
    openEnded: false,
  }

  warnEndDate = (_value, allValues) => {
    this.setState({ openEnded: allValues.openEnded });

    if (allValues.openEnded && allValues.endDate) {
      return (
        <div data-test-warn-clear-end-date>
          <FormattedMessage id="ui-licenses.warn.clearEndDate" />
        </div>
      );
    }

    return undefined;
  }

  validateEndDate = (value, allValues) => {
    if (value && allValues.startDate && (allValues.openEnded !== true)) {
      const startDate = new Date(allValues.startDate);
      const endDate = new Date(allValues.endDate);

      if (startDate >= endDate) {
        return (
          <div data-test-error-end-date-too-early>
            <FormattedMessage id="ui-licenses.errors.endDateGreaterThanStartDate" />
          </div>
        );
      }
    }

    return undefined;
  }

  render() {
    const { data } = this.props;

    return (
      <div
        id="amendment-form-info"
        label={<FormattedMessage id="ui-licenses.section.amendmentInformation" />}
      >
        <Row>
          <Col xs={12}>
            <FormattedMessage id="ui-licenses.placeholder.amendmentName">
              {placeholder => (
                <Field
                  id="edit-amendment-name"
                  name="name"
                  label={<FormattedMessage id="ui-licenses.prop.name" />}
                  component={TextField}
                  placeholder={placeholder}
                  required
                  validate={required}
                />
              )}
            </FormattedMessage>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Field
              id="edit-amendment-status"
              component={Select}
              dataOptions={data.statusValues}
              name="status"
              label={<FormattedMessage id="ui-licenses.prop.status" />}
              required
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={5}>
            <Field
              backendDateStandard="YYYY-MM-DD"
              id="edit-amendment-start-date"
              name="startDate"
              label={<FormattedMessage id="ui-licenses.prop.startDate" />}
              component={Datepicker}
              dateFormat="YYYY-MM-DD"
            />
          </Col>
          <Col xs={10} md={5}>
            <Field
              backendDateStandard="YYYY-MM-DD"
              id="edit-amendment-end-date"
              name="endDate"
              label={<FormattedMessage id="ui-licenses.prop.endDate" />}
              component={Datepicker}
              dateFormat="YYYY-MM-DD"
              disabled={this.state.openEnded}
              validate={this.validateEndDate}
              warn={this.warnEndDate}
            />
          </Col>
          <Col xs={2} style={{ paddingTop: 20 }}>
            <Field
              id="edit-amendment-open-ended"
              name="openEnded"
              label={<FormattedMessage id="ui-licenses.prop.openEnded" />}
              component={Checkbox}
              type="checkbox"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <FormattedMessage id="ui-licenses.placeholder.amendmentDescription">
              {placeholder => (
                <Field
                  id="edit-amendment-description"
                  name="description"
                  label={<FormattedMessage id="ui-licenses.prop.description" />}
                  placeholder={placeholder}
                  component={TextArea}
                />
              )}
            </FormattedMessage>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AmendmentFormInfo;
