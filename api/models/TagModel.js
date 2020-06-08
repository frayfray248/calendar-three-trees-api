const db = require('../../database');
const mysql = require('mysql');

const Tag = function (tag) {
    this.name = tag.name;
};

module.exports = Tag;