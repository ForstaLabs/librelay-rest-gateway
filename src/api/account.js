const relay = require('librelay');


class AccountV1 {

    async find(params) {
        const atlasClient = await relay.AtlasClient.factory();
        return await atlasClient.getDevices();
    }

    async create(data, params) {
        const name = req.body.name || req.headers['user-agent'].split(/[\s/-]/)[0];
        await relay.registerAccount({name});
    }
}


module.exports = {
    AccountV1
};
