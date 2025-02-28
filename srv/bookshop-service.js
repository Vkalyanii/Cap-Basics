/** to use send grid we need install --- npm add @sendgrid/mail */

const cds = require('@sap/cds');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');  // Replace with your SendGrid API key

module.exports = (srv) => {
    // Handler for creating a new book
    srv.on('CREATE', 'Books', async (req) => {
        const newBook = req.data;

        // Save the new book to the database
        const db = await cds.connect.to('db');  // Connect to your database
        await db.run(INSERT.into('my.bookshop.Books').entries(newBook));

        // Get the current count of books after adding the new book
        const result = await db.run(SELECT.from('my.bookshop.Books').columns('count(ID) as totalBooks'));
        const totalBooksCount = result[0].totalBooks;

        // Send an email notification with the total count of books
        const msg = {
            to: 'kalyanif0004@gmail.com',  // Recipient email
            from: 'sripaloju47@gmail.com',  // Verified sender email in SendGrid
            subject: 'New Book Created - Bookshop Notification',
            text: `A new book has been created! Current count of books: ${totalBooksCount}`,
        };

        try {
            await sgMail.send(msg);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }

        return req.data;  // Return the newly created book record
    });
};
