CREATE TABLE IF NOT EXISTS catagory (
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
	catagory             INT,
	name                 VARCHAR (100),
	date_released        TIMESTAMP WITHOUT TIME ZONE,
	dimensions_x         DECIMAL,
	dimensions_y         DECIMAL,
	dimensions_z         DECIMAL,
	FOREIGN KEY ( catagory ) REFERENCES catagory( id )
);

CREATE TABLE IF NOT EXISTS lego_brick (
	id                   VARCHAR (50) NOT NULL PRIMARY KEY,
	name                 VARCHAR  NOT NULL,
	colour               INT,
	catagory             INT,
	weight               DECIMAL,
	dimensions_x         INT,
	dimensions_y         INT,
	dimensions_z         INT,
	date_from            TIMESTAMP WITHOUT TIME ZONE,
	date_to              TIMESTAMP WITHOUT TIME ZONE,
	FOREIGN KEY ( colour ) REFERENCES lego_brick_colour( id ),
	FOREIGN KEY ( catagory ) REFERENCES catagory( id )
);

CREATE TABLE IF NOT EXISTS lego_brick_price_history (
	id 					INT NOT NULL PRIMARY KEY,
	brick_id 			VARCHAR (50) NOT NULL,
	price_point			DECIMAL NOT NULL,
	date_point 			TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	FOREIGN KEY ( brick_id ) REFERENCES lego_brick( id )
);

CREATE TABLE IF NOT EXISTS lego_set_price_history (
	id 					INT NOT NULL PRIMARY KEY,
	set_id 				VARCHAR (50) NOT NULL,
	price_point			DECIMAL NOT NULL,
	date_point 			TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	FOREIGN KEY ( set_id ) REFERENCES lego_set( id )
);

CREATE TABLE IF NOT EXISTS lego_brick_inventory (
	id                  VARCHAR (50) NOT NULL,
	stock				INT NOT NULL,
	price				DECIMAL NOT NULL,
	demand_factor		DECIMAL NOT NULL,
	backorder 		  	BOOLEAN,
	backorder_stock	  	INT,
	last_updated		TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	PRIMARY KEY ( id ),
	FOREIGN KEY ( id ) REFERENCES lego_brick( id )
);

CREATE TABLE IF NOT EXISTS lego_set_inventory (
	id                  VARCHAR (50) NOT NULL,
	stock				INT NOT NULL,
	price				DECIMAL NOT NULL,
	demand_factor		DECIMAL NOT NULL,
	backorder 		  	BOOLEAN,
	backorder_stock	  	INT,
	last_updated		TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	PRIMARY KEY ( id ),
	FOREIGN KEY ( id ) REFERENCES lego_set( id )
);

CREATE TABLE IF NOT EXISTS set_descriptor (
	id                   VARCHAR (50) NOT NULL PRIMARY KEY,
	set_id               VARCHAR (50) NOT NULL,
	brick_id             VARCHAR (50) NOT NULL,
	amount               INT,
	FOREIGN KEY ( set_id ) REFERENCES lego_set( id ),
	FOREIGN KEY ( brick_id ) REFERENCES lego_brick( id )
);

past transactions
