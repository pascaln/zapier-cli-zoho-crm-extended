const searchInvoiceById = (z, bundle) => {
    return z.request({
        url: `https://crm.zoho.eu/crm/private/json/Invoices/getRecordById?authtoken=${bundle.inputData.key}&scope=crmapi&id=${bundle.inputData.id}`,
        method: 'GET',
    }).then(response => {
        let result = JSON.parse(response.content);
        let values = result.response.result.Invoices.row.FL;

        let invoice = {};
        invoice.products = [];
        for(let i = 0; i < values.length; i++){
            let value = values[i];

            if (value.val == 'Subject') {
                invoice.subject = value.content;
            }
            if (value.val == 'Invoice Date') {
                invoice.date = value.content;
            }
            if (value.val == 'Invoice Number') {
                invoice.number = value.content;
            }
            if (value.val == 'ACCOUNTID') {
                invoice.accountId = value.content;
            }
            if (value.val == 'CONTACTID') {
                invoice.contactId = value.content;
            }
            if (value.val == 'Product Details') {
                let products = value.product;
                z.console.info('products', products);
                z.console.info('isArray', products.isArray);

                if (products instanceof Array) {
                    for(let j=0; j < products.length; j++) {
                        let product = products[j];
                        z.console.info('product', product);
                        invoice.products.push(parseProduct(product.FL));
                    }
                } else {
                    invoice.products.push(parseProduct(products.FL));
                }
            }
        }

        return [invoice];
    });
}

const parseProduct = (productValues) => {
    let product =  {};
    for(let j = 0; j < productValues.length; j++) {
        let productValue = productValues[j];
        if (productValue.val == 'Product Id') {
            product.id = productValue.content;
        }
        if (productValue.val == 'Quantity') {
            product.quantity = productValue.content;
        }
        if (productValue.val == 'Unit Price') {
            product.unitPrice = productValue.content;
        }
        if (productValue.val == 'Total') {
            product.total = productValue.content;
        }
        if (productValue.val == 'Discount') {
            product.discount = productValue.content;
        }
        if (productValue.val == 'Tax') {
            product.tax = productValue.content;
        }
    }

    return product;
}

module.exports = {
    key: 'invoice_by_id',

    // You'll want to provide some helpful display labels and descriptions
    // for users. Zapier will put them into the UX.
    noun: 'Invoice',
    display: {
        label: 'Find a Invoice by Id',
        description: 'Search for invoice by id.'
    },

    // `operation` is where we make the call to your API to do the search
    operation: {
        // This search only has one search field. Your searches might have just one, or many
        // search fields.
        inputFields: [
            {
                key: 'key',
                type: 'string',
                label: 'API Key',
            },
            {
                key: 'id',
                type: 'integer',
                label: 'Invoice Id',
            }
        ],

        perform: searchInvoiceById
    }
}    

