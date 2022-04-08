CREATE TABLE IF NOT EXISTS tag (
	id                   INT NOT NULL PRIMARY KEY,
	name                 VARCHAR (100)   
);

CREATE TABLE IF NOT EXISTS colour_type (
	id                   INT NOT NULL PRIMARY KEY,
	name                 VARCHAR (64)
);

CREATE TABLE IF NOT EXISTS lego_brick_colour (
	id                   INT NOT NULL PRIMARY KEY,
	name                 VARCHAR (100),
	hexrgb               VARCHAR (6) NOT NULL,
	col_type             INT,
	FOREIGN KEY ( col_type ) REFERENCES colour_type( id )
);

CREATE TABLE IF NOT EXISTS lego_set (
	id                   VARCHAR (50) NOT NULL PRIMARY KEY,
	name                 VARCHAR (100),
	description		  	 TEXT,
	date_released        TIMESTAMP WITHOUT TIME ZONE,
	dimensions_x         DECIMAL,
	dimensions_y         DECIMAL,
	dimensions_z         DECIMAL,
);

CREATE TABLE IF NOT EXISTS lego_brick (
	id                   VARCHAR (50) NOT NULL PRIMARY KEY,
	name                 VARCHAR  NOT NULL,
	colour               INT,
	weight               DECIMAL,
	dimensions_x         INT,
	dimensions_y         INT,
	dimensions_z         INT,
	date_from            TIMESTAMP WITHOUT TIME ZONE,
	date_to              TIMESTAMP WITHOUT TIME ZONE,
	FOREIGN KEY ( colour ) REFERENCES lego_brick_colour( id ),
);

CREATE TABLE IF NOT EXISTS lego_brick_tag (
	id                   VARCHAR (50) NOT NULL PRIMARY KEY,
	brick_id             VARCHAR (50) NOT NULL
	tag                  INT NOT NULL,
	FOREIGN KEY ( brick_id ) REFERENCES lego_brick( id ),
	FOREIGN KEY ( tag ) REFERENCES tag( id ),
)

CREATE TABLE IF NOT EXISTS lego_set_tag (
	id                   VARCHAR (50) NOT NULL PRIMARY KEY,
	set_id             VARCHAR (50) NOT NULL
	tag                  INT NOT NULL,
	FOREIGN KEY ( set_id ) REFERENCES lego_set( id ),
	FOREIGN KEY ( tag ) REFERENCES tag( id ),
)

CREATE TABLE IF NOT EXISTS set_descriptor (
	id                   VARCHAR (50) NOT NULL PRIMARY KEY,
	set_id               VARCHAR (50) NOT NULL,
	brick_id             VARCHAR (50) NOT NULL,
	amount               INT,
	FOREIGN KEY ( set_id ) REFERENCES lego_set( id ),
	FOREIGN KEY ( brick_id ) REFERENCES lego_brick( id )
);

CREATE TABLE IF NOT EXISTS lego_brick_inventory (
	id                  VARCHAR (50) NOT NULL PRIMARY KEY,
	stock				INT NOT NULL,
	price				DECIMAL NOT NULL,
	new_price			DECIMAL NOT NULL,
	last_updated		TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	FOREIGN KEY ( id ) REFERENCES lego_brick( id )
);

CREATE TABLE IF NOT EXISTS lego_set_inventory (
	id                  VARCHAR (50) NOT NULL PRIMARY KEY,
	stock				INT NOT NULL,
	price				DECIMAL NOT NULL,
	new_price			DECIMAL NOT NULL,
	last_updated		TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	FOREIGN KEY ( id ) REFERENCES lego_set( id )
);


CREATE TABLE IF NOT EXISTS users (
	id 					VARCHAR (50) NOT NULL PRIMARY KEY,
	email				text NOT NULL,
	first_name			text NOT NULL,
	last_name			text NOT NULL,
	address				text NOT NULL,
	postcode			text NOT NULL,	
	date_created		TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	date_updated		TIMESTAMP WITHOUT TIME ZONE NOT NULL,
);
