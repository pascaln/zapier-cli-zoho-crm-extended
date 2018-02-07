// We can roll up all our behaviors in an App.
const InvoiceById = require('./searches/invoiceById');
const NoteToContact = require('./creates/addNoteToContact');

const authentication = {
  type: 'custom',
  connectionLabel: 'Zoho CRM Account',
  test: {
    url:
        'https://crm.zoho.eu/crm/private/json/Notes/insertRecords'
  },
  fields: [
    {
      key: 'api_key',
      type: 'string',
      required: true,
      helpText: 'Zoho CRM API Key'
    }
  ]
};

const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,
  
// beforeRequest & afterResponse are optional hooks into the provided HTTP client
  beforeRequest: [
  ],

  afterResponse: [
  ],

  // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
  resources: {
  },

  // If you want your trigger to show up, you better include it here!
  triggers: {
  },

  // If you want your searches to show up, you better include it here!
  searches: {
    [InvoiceById.key]: InvoiceById,
  },

  // If you want your creates to show up, you better include it here!
  creates: {
    [NoteToContact.key]: NoteToContact,
  }
};

// Finally, export the app.
module.exports = App;
