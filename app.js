const nodemailer = require('nodemailer');
const config = require('./config');
const puppeteer = require('puppeteer');


const transporter = nodemailer.createTransport({
    service: 'yandex',
    auth: {
        user: config.email,
        pass: config.password
    }
});

const mailOptions = {
    from: config.from,
    to: config.to,
    subject: 'Tickets',
    text: '',
};

const sendEmail = () => {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent');
    });
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(config.url);
    await page.waitForSelector(config.SELECTOR_SPINNER, { hidden: true })
    await page.waitFor(1000);

    const ticketCost = await page.$eval(config.SELECTOR_TICKET_COST, el => {
        return el.attributes.amount.nodeValue
    })
    mailOptions.text = `Current price is ${ticketCost}`
    sendEmail()
    await browser.close();
})();