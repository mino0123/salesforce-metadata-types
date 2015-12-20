Parse Salesforce.com Metadata WSDL and return type definitions.

## Usage

```js
const fs = require('fs');
const parseMetadata = require('salesforce-metadata-types');

const wsdl = fs.readFileSync('./metadata.xml');
const types = parseMetadata(wsdl);
```
