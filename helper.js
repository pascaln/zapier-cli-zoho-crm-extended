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
    createAPIXML
}