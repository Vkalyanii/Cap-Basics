const cds = require('@sap/cds');
 
module.exports = cds.service.impl(async (srv) => {
    const { Books } = srv.entities;
 
    srv.on('READ', Books, async (req) => {
        const tr = cds.tx(req);
        const isAdmin = req.user.is('Admin')
        console.log(isAdmin)
        if (isAdmin) {
            try {
                const data = await tr.read(req.query);
                console.log(data);
                return data;
            } catch (error) {
                console.log('Error Reading Books', error);
                req.reject(500, error);
            }
        } else {
            req.reject(403, 'Forbidden: You are not authorized to access this resource');
        }
 
    })
 
 
 
    srv.on('CREATE', Books, async (req) => {
        const tr = cds.tx(req);
        if (req.data) {
            const data = req.data;
            const isAdmin = req.user.is('Admin');
            if (isAdmin) {
                try {
                    await tr.create(Books).entries(data);
                    console.log(data);
                    return data;
                } catch (error) {
                    console.log('Error at the time of creating Book', error);
 
                }
            } else {
                req.reject(403, 'Forbidden: You are not authorized to access this resource');
            }
 
        }
    })
});
 