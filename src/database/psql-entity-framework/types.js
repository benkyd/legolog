class DataTypes {
    static VARCHAR(length) {
        return `VARCHAR(${length})`;
    }

    static get INTEGER() {
        return 'INT';
    }

    static get BIGINT() {
        return 'BIGINT';
    }

    static get TEXT() {
        return 'TEXT';
    }

    static get BOOLEAN() {
        return 'BOOLEAN';
    }

    static get TIMESTAMP() {
        return 'TIMESTAMP WITHOUT TIME ZONE';
    }
}

module.exports = DataTypes;
