const axios = require('axios');
const cheerio = require('cheerio');

const fs = require('fs');
const uuid = require('uuid/v1');

const host_url = process.env.HOST_URL;
const csvFileName = `merchants-${uuid()}.csv`;

exports.getMerchants = async (req, res) => {
    const city = req.query.city;
    const category = req.query.category;
    const orderBy = req.query.orderBy;
    
    var categoryId = req.query.categoryId;
    if (categoryId) {
        categoryId = categoryId.replace(',','%2C');
    }

    var totalPage = 1;
    const perPage = 24;

    var merchants = [];

    for (var page = 1; page <= totalPage; page++) {
        url = `${host_url}/${city}/${category}?category_ids=${categoryId}&query=&page=${page}&category_type=${category}&order=${orderBy}`;

        const response = await axios.get(url);
        const $ = await cheerio.load(response.data);

        const script = await $('div[class="ui vertical segment no padding borderless"]').find('script').html();
        
        if (page == 1) {
            meta = await JSON.parse(script
                .match(/(meta:.+)/)[0]
                .replace('meta:', '{"meta":')
                .slice(0, -1)
                .concat('}')
            ).meta;
            totalPage = Math.ceil(meta / perPage);
        }
        
        const jsonMerchants = await JSON.parse(script
            .match(/(listings:.+)/)[0]
            .replace('listings:','{"listings":')
            .slice(0, -1)
            .concat('}')
        ).listings;

        await jsonMerchants.forEach(merchant => {
            merchants.push({
                id: merchant.company_id,
                merchant: merchant.company_name,
                location: merchant.outlet_names[0],
                details: merchant.url
            });
        });

        var progress = Math.round(page / totalPage * 100);
        console.log(`Page ${page} of ${totalPage} -- ${progress}%`);
    }

    const uniqueMerchants = await removeDuplicateMerchants(merchants, 'id');
    await writeCsv(uniqueMerchants);

    res.status(200).json({
        message: "Success",
        csv: csvFileName,
        count: uniqueMerchants.length,
        merchants: uniqueMerchants
    });
}

removeDuplicateMerchants = (merchants, fieldName) => {
    return uniqueMerchants = merchants
        .map(elem => elem[fieldName])
        .map((elem, i, final) => final.indexOf(elem) === i && i)
        .filter(elem => merchants[elem])
        .map(elem => merchants[elem]);
}

writeCsv = (merchants) => {
    const header = Object.keys(merchants[0]);
    let csv = merchants.map(row => header.map(fieldName => JSON.stringify(row[fieldName])).join(','));
    csv.unshift(header.join(','));
    csv = csv.join('\r\n');

    fs.writeFile(`./${csvFileName}`, csv, err => {
        if (err) {
            console.log(err);
        }
        console.log("CSV Saved");
    });
}