const searchAccountById = (z, bundle) => {
    return z.request({
        url: `https://crm.zoho.eu/crm/private/json/Contacts/getRecordById?authtoken=${bundle.authData.api_key}&scope=crmapi&id=${bundle.inputData.id}`,
        method: 'GET',
    }).then(response => {
        let result = JSON.parse(response.content);
        let values = result.response.result.Contacts.row.FL;

        let contact = {};
        for(let i = 0; i < values.length; i++){
            let value = values[i];
            contact[value.val] = value.content;
        }

        return [contact];
    });
}

module.exports = {
    key: 'contact_by_id',

    // You'll want to provide some helpful display labels and descriptions
    // for users. Zapier will put them into the UX.
    noun: 'Contact',
    display: {
        label: 'Find a Contact by Id',
        description: 'Search for contact by id.'
    },

    // `operation` is where we make the call to your API to do the search
    operation: {
        // This search only has one search field. Your searches might have just one, or many
        // search fields.
        inputFields: [
            {
                key: 'id',
                type: 'integer',
                label: 'Contact Id',
            }
        ],

        perform: searchAccountById
    }
}    

