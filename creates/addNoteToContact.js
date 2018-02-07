const addNoteToContact = (z, bundle) => {
    let url = `https://crm.zoho.eu/crm/private/json/Notes/insertRecords?authtoken=${bundle.authData.api_key}&newFormat=1&version=2&duplicateCheck=2&wfTrigger=true`;
    url += '&xmlData=' + createAPIXML('Notes', [{'entityId': bundle.inputData.contactId, 'Note Title' : bundle.inputData.title, 'Note Content' : bundle.inputData.content}] );
    
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

const createAPIXML = (module, data) => {
    let xml = '<' + module +'>';
    for (let i = 0; i < data.length; i++) {
        let values = data[i];
        xml += '<row no="' + (i + 1) +'">';
        
        for (let key in values) {
            xml += '<FL val="' + key + '"><![CDATA[' + values[key].trim() +']]></FL>'
        }    
        
        xml += '</row>';
    }
    xml += '</' + module +'>';

    return xml;
}

module.exports = {
    key: 'note_to_contact',

    // You'll want to provide some helpful display labels and descriptions
    // for users. Zapier will put them into the UX.
    noun: 'ContactNote',
    display: {
        label: 'Add a Note to a Contact',
        description: 'Adds a note to a contact'
    },

    // `operation` is where we make the call to your API to do the search
    operation: {
        // This search only has one search field. Your searches might have just one, or many
        // search fields.
        inputFields: [
            {
                key: 'contactId',
                type: 'integer',
                label: 'Contact Id',
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