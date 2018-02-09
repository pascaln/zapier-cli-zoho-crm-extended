const helper = require('../helper');
const addNoteToContact = (z, bundle) => {
    let url = `https://crm.zoho.eu/crm/private/json/Notes/insertRecords?authtoken=${bundle.authData.api_key}&newFormat=1&version=2&duplicateCheck=2&wfTrigger=true`;
    url += '&xmlData=' + helper.createAPIXML('Notes', [{'entityId': bundle.inputData.entityId, 'Note Title' : bundle.inputData.title, 'Note Content' : bundle.inputData.content}] );
    
    return z.request({
       url: url,
       method: 'POST',
    }).then(response => {
        z.console.info(response);

        let result = JSON.parse(response.content);
        let values = result.response.result.recorddetail.FL;

        let note = {};
        for(let i = 0; i < values.length; i++) {
            let value = values[i];

            if (value.val == 'Id') {
                note.id = value.content;
            }
        }
        return note;
    });
}

module.exports = {
    key: 'note_to_entity',

    // You'll want to provide some helpful display labels and descriptions
    // for users. Zapier will put them into the UX.
    noun: 'ContactNote',
    display: {
        label: 'Add a Note to a Entity',
        description: 'Adds a note to a entity'
    },

    // `operation` is where we make the call to your API to do the search
    operation: {
        // This search only has one search field. Your searches might have just one, or many
        // search fields.
        inputFields: [
            {
                key: 'entityId',
                type: 'integer',
                label: 'Entity Id',
            },            
            {
                key: 'title',
                type: 'string',
                label: 'Note Title',
            },            
            {
                key: 'content',
                type: 'text',
                label: 'Note Content',
            }
        ],

        perform: addNoteToContact
    }
}    