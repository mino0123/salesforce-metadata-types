const fs = require('fs');
const assert = require('assert');

const parseMetadata = require('../index');

const XML = `
<definitions>
 <types>
  <xsd:schema>
   <!-- complex type -->
   <xsd:complexType name="ComplexType">
    <xsd:sequence>
     <xsd:element name="stringParam"       type="xsd:string"       />
     <xsd:element name="doubleParam"       type="xsd:double"       />
     <xsd:element name="intParam"          type="xsd:int"          />
     <xsd:element name="longParam"         type="xsd:long"         />
     <xsd:element name="booleanParam"      type="xsd:boolean"      />
     <xsd:element name="dateParam"         type="xsd:date"         />
     <xsd:element name="timeParam"         type="xsd:time"         />
     <xsd:element name="dateTimeParam"     type="xsd:dateTime"     />
     <xsd:element name="base64BinaryParam" type="xsd:base64Binary" />
     <xsd:element name="anyTypeParam"      type="xsd:anyType"      />
     <xsd:element name="stringListParam"   type="xsd:string" maxOccurs="unbounded" />
    </xsd:sequence>
   </xsd:complexType>
   <!-- extension -->
   <xsd:complexType name="BaseType">
    <xsd:sequence />
   </xsd:complexType>
   <xsd:complexType name="SubType">
    <xsd:complexContent>
     <xsd:extension base="tns:BaseType">
      <xsd:sequence>
       <xsd:element name="stringParam"       type="xsd:string"       />
       <xsd:element name="doubleParam"       type="xsd:double"       />
       <xsd:element name="intParam"          type="xsd:int"          />
       <xsd:element name="longParam"         type="xsd:long"         />
       <xsd:element name="booleanParam"      type="xsd:boolean"      />
       <xsd:element name="dateParam"         type="xsd:date"         />
       <xsd:element name="timeParam"         type="xsd:time"         />
       <xsd:element name="dateTimeParam"     type="xsd:dateTime"     />
       <xsd:element name="base64BinaryParam" type="xsd:base64Binary" />
       <xsd:element name="anyTypeParam"      type="xsd:anyType"      />
       <xsd:element name="stringListParam"   type="xsd:string" maxOccurs="unbounded" />
      </xsd:sequence>
     </xsd:extension>
    </xsd:complexContent>
   </xsd:complexType>
   <!-- simpleType -->
   <xsd:simpleType name="SimpleType">
    <xsd:restriction base="xsd:string">
     <xsd:enumeration value="value1"/>
     <xsd:enumeration value="value2"/>
    </xsd:restriction>
   </xsd:simpleType>
   <!-- empty sequence -->
   <xsd:complexType name="EmptySequence">
    <xsd:complexContent>
     <xsd:extension base="tns:BaseType">
      <xsd:sequence/>
     </xsd:extension>
    </xsd:complexContent>
   </xsd:complexType>
  </xsd:schema>
 </types>
</definitions>
`;

describe('default exports', function () {
  var types;
  before(function () {
    types = parseMetadata(XML);
  });
  describe('return value', function () {
    it('contains complex type', function () {
      assert.deepEqual(types[0], {
          name: 'ComplexType',
          members:
          [
            { name: 'stringParam', type: 'string', isArray: false },
            { name: 'doubleParam', type: 'number', isArray: false },
            { name: 'intParam', type: 'number', isArray: false },
            { name: 'longParam', type: 'number', isArray: false },
            { name: 'booleanParam', type: 'boolean', isArray: false },
            { name: 'dateParam', type: 'string', isArray: false },
            { name: 'timeParam', type: 'number', isArray: false },
            { name: 'dateTimeParam', type: 'string', isArray: false },
            { name: 'base64BinaryParam', type: 'any', isArray: false },
            { name: 'anyTypeParam', type: 'any', isArray: false },
            { name: 'stringListParam', type: 'string', isArray: true }
          ]
        }
      );
    });
    it('contains base type', function () {
      assert.deepEqual(types[1], {name: 'BaseType', members: []})
    });
    it('contains sub type', function () {
      assert.deepEqual(types[2], {
          name: 'SubType',
          base: 'BaseType',
          members:
          [
            { name: 'stringParam', type: 'string', isArray: false },
            { name: 'doubleParam', type: 'number', isArray: false },
            { name: 'intParam', type: 'number', isArray: false },
            { name: 'longParam', type: 'number', isArray: false },
            { name: 'booleanParam', type: 'boolean', isArray: false },
            { name: 'dateParam', type: 'string', isArray: false },
            { name: 'timeParam', type: 'number', isArray: false },
            { name: 'dateTimeParam', type: 'string', isArray: false },
            { name: 'base64BinaryParam', type: 'any', isArray: false },
            { name: 'anyTypeParam', type: 'any', isArray: false },
            { name: 'stringListParam', type: 'string', isArray: true }
          ]
      });
    });
    it('contains simple type', function () {
      assert.deepEqual(types[3], {
        name: 'EmptySequence',
        base: 'BaseType',
        members: []
      });
    });
  });
  xdescribe('parse actual metadata.xml', function () {
    it('passed', function () {
      const xml = fs.readFileSync('./metadata.xml');
      const result = parseMetadata(xml);
    });
  });
});
