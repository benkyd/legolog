class RelationshipTypes {
    static PRIMARY_KEY() {
        return "PRIMARY KEY";
    }

    static get UNIQUE() {
        return 'UNIQUE';
    }

    static get NOT_NULL() {
        return 'NOT NULL';
    }

    static get REFERENCES() {
        return 'REFERENCES';
    }

    static FOREIGN_KEY(references) {
        return { references };
    }
}

module.exports = RelationshipTypes;
