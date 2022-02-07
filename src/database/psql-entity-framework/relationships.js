class RelationshipTypes {
    static get UNIQUE() {
        return 'UNIQUE';
    }

    static get NOT_NULL() {
        return 'NOT NULL';
    }

    static get REFERENCES() {
        return 'REFERENCES';
    }

    static FOREIGN_KEY(localKey, foreignKey) {
        return `FOREIGN KEY (${localKey}) REFERENCES ${foreignKey}`;
    }
}

module.exports = DataTypes;
