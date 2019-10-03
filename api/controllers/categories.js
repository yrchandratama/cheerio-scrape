const axios = require('axios');
const cheerio = require('cheerio');

// const fs = require('fs');
// const uuid = require('uuid/v1');

const host_url = process.env.HOST_URL;

exports.getCategories = async (req, res) => {
    const city = req.query.city;
    const url = `${host_url}/${city}/eat`;

    const response = await axios.get(url);

    const $ = await cheerio.load(response.data);
    const script = await $('div[class="ui vertical segment no padding borderless"]').find('script').html();

    const jsonCategory = await JSON.parse(script
        .match(/(filters:.+)/)[0]
        .replace('filters:','{"filters":')
        .slice(0, -1)
        .concat('}')
    ).filters.filters;

    var categories = [];

    for (var i = 0; i < jsonCategory.length; i++) {
        var index = await jsonCategory[i].sections.findIndex(obj => obj.query_type == 'category_ids');

        if (index != -1) {
            var n = await jsonCategory[i].sections[index].data.length;
            var subCategories = [];

            for (var j = 0; j < n; j++) {
                subCategories.push({
                    id: jsonCategory[i].sections[index].data[j].id,
                    name: jsonCategory[i].sections[index].data[j].name
                });
            }

            categories.push({
                type: jsonCategory[i].type,
                subCategories: subCategories
            });
        }
    }

    res.status(200).json({
        message: "Success",
        categories: categories
    });
}