import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { Button, Card, Col, InfoPopover, Row, Select, TextArea, TextField } from '@folio/stripes/components';
import { IntlConsumer } from '@folio/stripes/core';

import { required } from '../../../util/validators';

export default class TermFieldEdit extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    meta: PropTypes.shape({
      invalid: PropTypes.bool,
      pristine: PropTypes.bool,
      submitting: PropTypes.bool,
    }),
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    pickLists: PropTypes.arrayOf(PropTypes.object),
  }

  booleanToString = booleanValue => booleanValue.toString()

  stringToBoolean = stringValue => stringValue === 'true'

  render() {
    const {
      input: { name, value },
      meta,
      onCancel,
      onSave,
      pickLists,
    } = this.props;

    return (
      <IntlConsumer>
        {intl => (
          <Card
            data-test-term-name={name}
            headerStart={(
              <strong>
                {value.id ?
                  <FormattedMessage id="ui-licenses.settings.terms.editLicenseTerm" /> :
                  <FormattedMessage id="ui-licenses.settings.terms.newLicenseTerm" />}
              </strong>
            )}
            headerEnd={(
              <span>
                <Button
                  data-test-term-cancel-btn
                  marginBottom0
                  onClick={onCancel}
                >
                  <FormattedMessage id="stripes-core.button.cancel" />
                </Button>
                <Button
                  buttonStyle="primary"
                  data-test-term-save-btn
                  disabled={meta.invalid || meta.pristine || meta.submitting}
                  marginBottom0
                  onClick={onSave}
                >
                  <FormattedMessage id="stripes-core.button.save" />
                </Button>
              </span>
            )}
          >
            <Row>
              <Col xs={6}>
                <Field
                  component={TextField}
                  label={<FormattedMessage id="ui-licenses.settings.terms.term.label" />}
                  name={`${name}.label`}
                  required
                  startControl={<InfoPopover content={<FormattedMessage id="ui-licenses.settings.terms.help.label" />} />}
                  validate={required}
                />
              </Col>
              <Col xs={6}>
                <Field
                  component={TextField}
                  label={<FormattedMessage id="ui-licenses.settings.terms.term.name" />}
                  name={`${name}.name`}
                  required
                  startControl={<InfoPopover content={<FormattedMessage id="ui-licenses.settings.terms.help.name" />} />}
                  validate={v => {
                    if (v && v.length) {
                      return /^[a-z][a-z0-9]*$/i.test(v) ?
                        undefined : <FormattedMessage id="ui-licenses.errors.termNameHasNonAlpha" />;
                    }

                    return required(v);
                  }}
                />
              </Col>
            </Row>
            <Field
              component={TextArea}
              label={<FormattedMessage id="ui-licenses.settings.terms.term.description" />}
              name={`${name}.description`}
              required
              validate={required}
            />
            <Row>
              <Col xs={4}>
                <Field
                  component={TextField}
                  label={<FormattedMessage id="ui-licenses.settings.terms.term.orderWeight" />}
                  name={`${name}.weight`}
                  required
                  validate={required}
                  type="number"
                />
              </Col>
              <Col xs={4}>
                <Field
                  component={Select}
                  dataOptions={[
                    { label: intl.formatMessage({ id: 'ui-licenses.yes' }), value: 'true' },
                    { label: intl.formatMessage({ id: 'ui-licenses.no' }), value: 'false' },
                  ]}
                  format={this.booleanToString}
                  label={<FormattedMessage id="ui-licenses.settings.terms.term.primaryTerm" />}
                  name={`${name}.primary`}
                  parse={this.stringToBoolean}
                  required
                  validate={required}
                />
              </Col>
              <Col xs={4}>
                <Field
                  component={Select}
                  dataOptions={[
                    { label: intl.formatMessage({ id: 'ui-licenses.term.internalTrue' }), value: 'true' },
                    { label: intl.formatMessage({ id: 'ui-licenses.term.internalFalse' }), value: 'false' },
                  ]}
                  format={this.booleanToString}
                  label={<FormattedMessage id="ui-licenses.settings.terms.term.defaultVisibility" />}
                  name={`${name}.defaultInternal`}
                  parse={this.stringToBoolean}
                  required
                  validate={required}
                />
              </Col>
            </Row>
            { /* Users can only configure the type of a term when creating it, not when editing it */ }
            { value.id === undefined &&
              <Row>
                <Col xs={6}>
                  <Field
                    component={Select}
                    dataOptions={[
                      { label: '', value: '' },
                      { label: intl.formatMessage({ id: 'ui-licenses.settings.terms.type.decimal' }), value: 'Decimal' },
                      { label: intl.formatMessage({ id: 'ui-licenses.settings.terms.type.integer' }), value: 'Integer' },
                      { label: intl.formatMessage({ id: 'ui-licenses.settings.terms.type.pickList' }), value: 'Refdata' },
                      { label: intl.formatMessage({ id: 'ui-licenses.settings.terms.type.text' }), value: 'Text' },
                    ]}
                    label={<FormattedMessage id="ui-licenses.settings.terms.term.type" />}
                    name={`${name}.type`}
                    required
                    validate={required}
                  />
                </Col>
                <Col xs={6}>
                  { value.type === 'Refdata' &&
                    <Field
                      component={Select}
                      dataOptions={[
                        { label: '', value: '' },
                        ...pickLists
                      ]}
                      label={<FormattedMessage id="ui-licenses.settings.terms.term.pickList" />}
                      name={`${name}.category`}
                      required
                      validate={required}
                    />
                  }
                </Col>
              </Row>
            }
          </Card>
        )}
      </IntlConsumer>
    );
  }
}
