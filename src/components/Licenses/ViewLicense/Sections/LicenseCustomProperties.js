import React from 'react';
import { FormattedMessage } from 'react-intl';
import css from './LicenseCustomProperties.css';
import {
  Accordion,
  Col,
  Row,
} from '@folio/stripes/components';


const camelCaseSplit = /([A-Z])(?![A-Z])/gm;

let nicePropertyName = (pName) => {
  let str = pName.replace(camelCaseSplit, ' $1')
  return str.charAt(0).toUpperCase() + str.slice(1);
};

let renderCustomPropertyValue = (type, value) => {
  if (type.endsWith("CustomPropertyRefdata")) {
    // output value.value
    return value.value
  }
  
  return value;
};

let renderCustomPropertyValues = ( entries ) => {
  let renderedValues = []
  entries.forEach ( ( entry, index ) => {
    console.log("ind: %o", index);
    renderedValues.push(<Col xs={12} md={8} mdOffset={ ( (index == 0) ? null : 4 ) } className={ (index > 0 ? 'subsequentRow' : null) } >{renderCustomPropertyValue(entry.type, entry.value)}</Col>)
  })
  
  return renderedValues;
};

let renderCustomProperties = (customProperties) =>{
  let propertyList = []
  Object.keys(customProperties).forEach(function(propertyName) {
    let entries = customProperties[propertyName]
    propertyList.push(<Row className={css.licenseCustomPropsRow} >
      <Col xs={12} md={4} className={css.licenseCustomPropName} >{nicePropertyName(propertyName)}</Col>
      { renderCustomPropertyValues(entries) }
    </Row>);
  });
  
  return propertyList;
};

const LicenseCustomProperties = ({ license, id, onToggle, open } ) => (
  <Accordion id={id} label={<FormattedMessage id="ui-licenses.licenses.customProperties" />} open={open} onToggle={onToggle} >
    { renderCustomProperties(license.customProperties) }
  </Accordion>
);

export default LicenseCustomProperties;
