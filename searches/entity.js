const searchEntityByCriteria = (z, bundle) => {
    return z.request({
        url: `https://crm.zoho.eu/crm/private/json/${bundle.inputData.module}/searchRecords?authtoken=${bundle.authData.api_key}&scope=crmapi&criteria=${bundle.inputData.criteria}`,
        method: 'GET',
    }).then(response => {
        let result = JSON.parse(response.content);
        if (result.response.nodata !== undefined) {
            return [];
        }
        let values = result.response.result[bundle.inputData.module].row;

        let results = [];

        if (!Array.isArray(values)) {
            results = [values];
        } else {
          results = values;
        }

        let searches = [];
        z.console.info("length: ", results.length);

        for (let j = 0; j < results.length; j++) {
            let rows = results[j].FL;
            let entity =  {};
            for (let i = 0; i < rows.length; i++) {
                let entries = rows[i];
                entity[entries.val] = entries.content;
            }
            searches.push(entity);
        }
        return searches;
    });
}

module.exports = {
    key: 'entity_by_criteria',

    // You'll want to provide some helpful display labels and descriptions
    // for users. Zapier will put them into the UX.
    noun: 'EntitySearch',
    display: {
        label: 'Search a Entity by Criteria',
        description: 'Search for entity by criteria.'
    },

    // `operation` is where we make the call to your API to do the search
    operation: {
        // This search only has one search field. Your searches might have just one, or many
        // search fields.
        inputFields: [
            {
                key: 'module',
                type: 'string',
                label: 'Module Name',
            },
            {
                key: 'criteria',
                type: 'string',
                label: 'Criteria',
            }
        ],

        perform: searchEntityByCriteria
    }
}

