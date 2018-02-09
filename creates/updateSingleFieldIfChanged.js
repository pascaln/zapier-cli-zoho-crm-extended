const helper = require('../helper');
const updateEntityField = (z, bundle) => {

    if (bundle.inputData.value_old == bundle.inputData.value_new) {
        return {'Status' : 'Not updated'};
    }

    let values = {};
    values[bundle.inputData.field] = bundle.inputData.value_new;
    let xml = helper.createAPIXML(bundle.inputData.module, [values]);
    z.console.info("xml: ", xml);
    let url = `https://crm.zoho.eu/crm/private/json/${bundle.inputData.module}/updateRecords?authtoken=${bundle.authData.api_key}&id=${bundle.inputData.entity_id}&newFormat=1&version=2&duplicateCheck=2&wfTrigger=false`;
    url += '&xmlData=' + xml;

    return z.request({
        url: url,
        method: 'GET',
    }).then(response => {
        z.console.info(response);

        let result = JSON.parse(response.content);
        let values = result.response.result.recorddetail.FL;

        let entity = {};
        for(let i = 0; i < values.length; i++) {
            let value = values[i];

            if (value.val == 'Id') {
                entity.id = value.content;
            }
        }
        return entity;
    });

}

module.exports = {
    key: 'entity_singel_field_update',

    // You'll want to provide some helpful display labels and descriptions
    // for users. Zapier will put them into the UX.
    noun: 'SingleFieldUpdate',
    display: {
        label: 'Updates a Single Field of a Entity',
        description: 'Updates a single field of a entity'
    },

    // `operation` is where we make the call to your API to do the search
    operation: {
        // This search only has one search field. Your searches might have just one, or many
        // search fields.
        inputFields: [
            {
                key: 'module',
                type: 'string',
                label: 'Module',
            },
            {
                key: 'entity_id',
                type: 'integer',
                label: 'Entity Id',
            },
            {
                key: 'field',
                type: 'string',
                label: 'Field Name',
            },
            {
                key: 'value_old',
                type: 'string',
                label: 'Old Value',
            },
            {
                key: 'value_new',
                type: 'string',
                label: 'New Value',
            }
        ],

        perform: updateEntityField
    }
}