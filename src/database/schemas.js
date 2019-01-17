const Realm = require('realm');
export const DEVICES_SCHEMA = "Devices";

export const DevicesSchema = {
    name: DEVICES_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: 'string',
        location: 'string',
        command: 'string',
        status: 'int',
        color: 'string'
    }
}

export const databaseOptions = {
    path: 'Devices.realm',
    schema: [ DevicesSchema ],
    schemaVersion: 0,
}
