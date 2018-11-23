import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Icon,
  Layout,
  Pane,
  Layer,
  Button,
} from '@folio/stripes/components';

import {
  LicenseInfo,
  LicenseCustomProperties,
} from './Sections';

import EditLicense from '../EditLicense';

class ViewLicense extends React.Component {
  static manifest = Object.freeze({
    selectedLicense: {
      type: 'okapi',
      path: 'licenses/licenses/:{id}',
    },
    query: {},
  });

  static propTypes = {
    match: PropTypes.object,
    onClose: PropTypes.func,
    parentResources: PropTypes.object,
    paneWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stripes: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.getActionMenu = this.getActionMenu.bind(this);
  }

  state = {
    sections: {
      licenseInfo: true,
      licenseProperties: true
    }
  }

  getLicense() {
    return get(this.props.resources.selectedLicense, ['records', 0], {});
  }

  getSectionProps() {
    return {
      license: this.getLicense(),
      onToggle: this.handleSectionToggle,
      stripes: this.props.stripes,
    };
  }

  handleSectionToggle = ({ id }) => {
    this.setState((prevState) => ({
      sections: {
        ...prevState.sections,
        [id]: !prevState.sections[id],
      }
    }));
  }

  handleSubmit = (license) => {
    this.props.mutator.selectedLicense.PUT(license)
      .then(() => this.props.onCloseEdit());
  }

  renderLoadingPane() {
    return (
      <Pane
        id="pane-view-license"
        defaultWidth={this.props.paneWidth}
        paneTitle="Loading..."
        dismissible
        onClose={this.props.onClose}
      >
        <Layout className="marginTop1">
          <Icon icon="spinner-ellipsis" width="100px" />
        </Layout>
      </Pane>
    );
  }

  renderEditLayer() {
    const { resources: { query } } = this.props;

    return (
      <Layer
        isOpen={query.layer === 'edit'}
        contentLabel={<FormattedMessage id="ui-licenses.licenses.editLicense" />}
      >
        <EditLicense
          {...this.props}
          onSubmit={this.handleSubmit}
          parentMutator={this.props.mutator}
          initialValues={this.getLicense()}
        />
      </Layer>
    );
  }

  getActionMenu({ onToggle }) {
    const { onEdit, editLink, stripes: { hasPerm } } = this.props;
    const items = [];

    /**
     * Can edit
     */
    if (hasPerm('ui-licenses.licenses.edit')) {
      items.push({
        id: 'clickable-edit-license',
        label: <FormattedMessage id="ui-licenses.licenses.edit" />,
        ariaLabel: <FormattedMessage id='ui-licenses.licenses.editLicense'/>,
        href: editLink,
        onClick: onEdit,
        icon: 'edit',
      });
    }

    /**
     * We only want to render the action menu
     * if we have something to show
     */
    if (!items.length) {
      return null;
    }

    /**
     * Return action menu
     */
    return (
      <Fragment>
        {items.map((item, index) => (
          <Button
            key={index}
            buttonStyle="dropdownItem"
            id={item.id}
            aria-label={item.ariaLabel}
            href={item.href}
            onClick={() => {
              // Toggle the action menu dropdown
              onToggle();
              item.onClick();
            }}
          >
            <Icon icon={item.icon}>
              {item.label}
            </Icon>
          </Button>
        ))}
      </Fragment>
    );
  }

  render() {
    const license = this.getLicense();
    if (!license) return this.renderLoadingPane();

    const sectionProps = this.getSectionProps();

    return (
      <Pane
        id="pane-view-license"
        defaultWidth={this.props.paneWidth}
        paneTitle={license.name}
        dismissible
        onClose={this.props.onClose}
        // actionMenu={this.getActionMenu}
      >
        <AccordionSet>
          <LicenseInfo id="licenseInfo" open={this.state.sections.licenseInfo} {...sectionProps} />
          {(license.customProperties && Object.keys(license.customProperties).length > 0) ? <LicenseCustomProperties id="licenseCustomProperties" open={this.state.sections.licenseCustomProperties} {...sectionProps} /> : null}
        </AccordionSet>
        
        { this.renderEditLayer() }
      </Pane>
    );
  }
}

export default ViewLicense;
