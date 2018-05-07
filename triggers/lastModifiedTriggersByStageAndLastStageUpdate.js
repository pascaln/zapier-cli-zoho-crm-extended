const triggerDealsWithStageAndLastStageUpdate = (z, bundle) => {
    let today = new Date();
    let daysBack = 5;

    //Do not return data on weekends
    if (today.getDay() == 0 || today.getDay() == 6) {
        return [];
    }

    let lastModifiedDate = new Date();
    lastModifiedDate.setDate(today.getDate() - daysBack - 2);
    let lastModifiedTime = lastModifiedDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');

    let criteria = '(Stage:' + bundle.inputData.stage + ')';

    return z.request({
        url: `https://crm.zoho.eu/crm/private/json/Deals/searchRecords?authtoken=${bundle.authData.api_key}&scope=crmapi&lastModifiedTime='${lastModifiedTime}&criteria=${criteria}`,
        method: 'GET',
    }).then(response => {
        let result = JSON.parse(response.content);
        if (result.response.result == undefined || result.response.result.Deals == undefined) {
            return [];
        }

        let values = result.response.result.Deals.row;

        let results = [];

        if (!Array.isArray(values)) {
            results = [values];
        } else {
            results = values;
        }

        let searches = [];

        let compareDate = new Date();
        //Do more days back if weekend
        switch(today.getDay()) {
            case 1: compareDate.setDate(compareDate.getDate() - daysBack - 2); break;
            case 2: compareDate.setDate(compareDate.getDate() - daysBack - 1); break;
            default: compareDate.setDate(today.getDate() - daysBack);
        }

        for (let j = 0; j < results.length; j++) {
            let rows = results[j].FL;
            let entity =  {};
            for (let i = 0; i < rows.length; i++) {
                let entries = rows[i];
                entity[entries.val] = entries.content;
            }

            if (entity['Last Stage Update'] == undefined
                || entity['Last Stage Update'] == null
                || new Date(entity['Last Stage Update']) > compareDate) {
                continue;
            }
            entity.id = entity.DEALID + entity['Last Stage Update'];
            searches.push(entity);
        }
        return searches;
    });
}

module.exports = {
    key: 'deals_last_stage_update',

    // You'll want to provide some helpful display labels and descriptions
    // for users. Zapier will put them into the UX.
    noun: 'DealsLastStageUpdate',
    display: {
        label: 'Triggers Deals That Have LastStageUpdate Longer Then 3 Days Ago',
        description: 'Triggers deals that have LastStageUpdate longer then 3 days ago'
    },

    // `operation` is where we make the call to your API to do the search
    operation: {
        // This search only has one search field. Your searches might have just one, or many
        // search fields.
        inputFields: [
            {
                key: 'stage',
                type: 'string',
                label: 'Stage',
            }
        ],

        perform: triggerDealsWithStageAndLastStageUpdate
    }
}