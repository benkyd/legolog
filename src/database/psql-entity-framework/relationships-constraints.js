class RelationshipTypes {
    static get PRIMARY_KEY() {
        return 'PRIMARY KEY';
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

    // NOT a string, ER framework will handle this
    static FOREIGN_KEY_REF(references) {
        return { fk: { ref: references } };
    }

    // ONE TO ONE RELATIONSHIP, again ER framework will handle this
    static FOREIGN_KEY_121(type, references) {
        return { fk: { ref: references }, type, constraints: [this.UNIQUE] };
    }
}

module.exports = RelationshipTypes;
