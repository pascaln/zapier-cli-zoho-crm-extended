const searchAccountById = (z, bundle) => {
    return z.request({
        url: `https://crm.zoho.eu/crm/private/json/Accounts/getRecordById?authtoken=${bundle.authData.api_key}&scope=crmapi&id=${bundle.inputData.id}`,
        method: 'GET',
    }).then(response => {
        let result = JSON.parse(response.content);
        let values = result.response.result.Accounts.row.FL;

        let account = {};
        for(let i = 0; i < values.length; i++){
            let value = values[i];
            account[value.val] = value.content;
        }

        return [account];
    });
}

module.exports = {
    key: 'account_by_id',

    // You'll want to provide some helpful display labels and descriptions
    // for users. Zapier will put them into the UX.
    noun: 'Account',
    display: {
        label: 'Find a Account by Id',
        description: 'Search for account by id.'
    },

    // `operation` is where we make the call to your API to do the search
    operation: {
        // This search only has one search field. Your searches might have just one, or many
        // search fields.
        inputFields: [
            {
                key: 'id',
                type: 'integer',
                label: 'Account Id',
            }
        ],

        perform: searchAccountById
    }
}    

