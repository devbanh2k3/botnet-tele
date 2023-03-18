var request = require('request');
var options = {
    'method': 'GET',
    'url': 'https://mbasic.facebook.com/',
    'headers': {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Cookie': 'datr=ILkFZEU__uQbS-XRABlPDPhc; sb=ILkFZP8kIgFc1c4K4vftHLTD'
    }
};
request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
