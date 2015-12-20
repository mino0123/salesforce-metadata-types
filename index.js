const parseString = require('node-xml-lite').parseString;

// node-xml-lite
/**
 * @private
 * @typedef {string|XmlLiteElement} XmlLiteNode
 */
/**
 * @private
 * @typedef XmlLiteElement
 * @property {string} name
 * @property {Object} attrib
 * @property {Array<XmlLiteNode>} childs
 */

// this package
/**
 * @typedef {Object} TypeDefinition
 * @property {string} name
 * @property {string} base
 * @property {Array<TypeDefinitionMember>} members
 * @property {Array<string>} enumerations
*/
/**
 * @typedef {Object} TypeDefinitionMember
 * @property {string} name
 * @property {string} type
 * @property {boolean} isArray
*/

/**
 * @param {String} wsdl
 * @returns {Array<TypeDefinition>}
 */
module.exports = function parseMetadataWSDL(wsdl) {
  const root = parseString(wsdl);
  const typesEl = childByName(root, 'types');
  const schema = childByName(typesEl, 'xsd:schema');
  const complexTypeElements = childrenByName(schema, 'xsd:complexType');
  const simpleTypeElements = childrenByName(schema, 'xsd:simpleType');
  const complexTypes = complexTypeElements.map(processComplexType);
  const simpleTypes = simpleTypeElements.map(processSimpleType);
  return complexTypes.concat(simpleTypes);
};


/**
 * @param {XmlLiteElement} el
 * @param {String} name
 * @returns {XmlLiteElement}
 */
function childByName(el, name) {
  return (el.childs || []).find((c) => c.name === name);
}

/**
 * @param {XmlLiteElement} el
 * @param {String} name
 * @returns {Array<XmlLiteElement>}
 */
function childrenByName(el, name) {
  return (el.childs || []).filter((c) => c.name === name);
}

/**
 * @param {string} xmlType
 * @return {string} type name in javascript|typescript
 */
function xmlTypeToJSType(xmlType) {
  const type = ({
    'xsd:string'      : 'string',
    'xsd:double'      : 'number',
    'xsd:int'         : 'number',
    'xsd:long'        : 'number',
    'xsd:boolean'     : 'boolean',
    'xsd:date'        : 'string',
    'xsd:time'        : 'number',
    'xsd:dateTime'    : 'string',
    'xsd:base64Binary': 'any',
    'xsd:anyType'     : 'any',
  })[xmlType];
  if (type) {
    return type;
  }
  if (/^tns:/.test(xmlType)) {
    return xmlType.replace(/^tns:/, '');
  }
  throw new Error(`Unexpected xml type: ${xmlType}`);
}

/**
 * @param {XmlLiteElement} el
 * @returns {TypeDefinition}
 */
function processComplexType(el) {
  const ret = {};
  ret.name = el.attrib.name;
  var base;
  var sequenceEl = childByName(el, 'xsd:sequence');
  const complexContentEl = childByName(el, 'xsd:complexContent');
  if (complexContentEl) {
    const extensionEl = childByName(complexContentEl, 'xsd:extension');
    sequenceEl = childByName(extensionEl, 'xsd:sequence');
    ret.base = extensionEl.attrib.base.replace(/^tns:/, '');
  }
  ret.members = processSequence(sequenceEl);
  return ret;
}

/**
 * @param {XmlLiteElement} el
 * @returns {Array<TypeDefinitionMember>}
 */
function processSequence(el) {
  const elements = childrenByName(el, 'xsd:element');
  return elements.map(function (el) {
    const isArray = el.attrib.maxOccurs === 'unbounded';
    return {
      name: el.attrib.name,
      type: xmlTypeToJSType(el.attrib.type),
      isArray
    };
  });
}

/**
 * @param {XmlLiteElement} el
 * @returns {Array<TypeDefinitionMember>}
 */
function processSimpleType(el) {
  const restrictionEl = childByName(el, 'xsd:restriction');
  var baseType = xmlTypeToJSType(restrictionEl.attrib.base);
  if (baseType === 'string') {
    baseType = 'String';
  }
  const enumerations = childrenByName(restrictionEl, 'xsd:enumeration');
  const enumerationValues = enumerations.map((el) => el.attrib.value);
  const ret = {
    name: el.attrib.name,
    base: baseType,
    enumerations: enumerationValues,
  };
  return ret;
}
