require('babel-polyfill');
const knex = require('../../connection');

export async function getAllPersons() {
    return await knex.select().from('person');
}

export const getPersonById = (id) => {
    return knex.select().from('person').where('personId', id)
        .then(person => person)
        .catch(error => {
            throw error});
}

export const getPersonByShibbolethId = (shibbolethId) => {
    return knex.select().from('person').where('shibbolethId', shibbolethId);
}

export async function savePerson(personData) {
    return await knex('person')
        .returning('personId')
        .insert(personData)
        .then(personId => personId[0])
        .catch(error => {
            throw error});
}

export async function savePersonRole(personRoleData) {
    return await knex('personWithRole')
        .returning('personRoleId')
        .insert(personRoleData)
        .then(personRoleId => personRoleId[0])
        .catch(error => {
            throw error});
}

export async function updatePerson(personData) {
    return await knex('person')
        .returning('personId')
        .where('personId', '=', personData.personId)
        .update(personData)
        .then(personId => personId)
        .catch(error =>  {
            throw error});
}

export const getAgreementPersonsByAgreementId = (id) => {
    //TODO: figure out why this returns duplicates without distinct
    return knex.distinct('person.firstname', 'person.lastname', 'personWithRole.personRoleId').select().from('agreementPerson')
        .leftJoin('personWithRole', 'agreementPerson.personRoleId', '=', 'personWithRole.personRoleId')
        .leftJoin('person', 'personWithRole.personId', '=', 'person.personId')
        .where('agreementId', id)
        .then(persons => {
            return persons;
        });
}
