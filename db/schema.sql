
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
	hexrgb               VARCHAR (6),
	col_type             INT,
	FOREIGN KEY ( col_type ) REFERENCES colour_type( id )
);

CREATE TABLE IF NOT EXISTS lego_brick (
	id                   VARCHAR (50) NOT NULL PRIMARY KEY,
	name                 VARCHAR  NOT NULL,
	weight               VARCHAR (10),
	dimensions_x         VARCHAR (10),
	dimensions_y         VARCHAR (10),
	dimensions_z         VARCHAR (10)
);

CREATE TABLE IF NOT EXISTS lego_set (
	id                   VARCHAR (50) NOT NULL PRIMARY KEY,
	name                 VARCHAR (100),
	description		  	 TEXT,
	date_released        TIMESTAMP WITHOUT TIME ZONE,
	dimensions_x         VARCHAR (10),
	dimensions_y         VARCHAR (10),
	dimensions_z         VARCHAR (10)
);

CREATE TABLE IF NOT EXISTS lego_brick_tag (
	id                   VARCHAR (50) NOT NULL PRIMARY KEY,
	brick_id             VARCHAR (50) NOT NULL,
	tag                  INT NOT NULL,
	FOREIGN KEY ( brick_id ) REFERENCES lego_brick( id ),
	FOREIGN KEY ( tag ) REFERENCES tag( id )
);

CREATE TABLE IF NOT EXISTS lego_set_tag (
	id                   VARCHAR (50) NOT NULL PRIMARY KEY,
	set_id             	 VARCHAR (50) NOT NULL,
	tag                  INT NOT NULL,
	FOREIGN KEY ( set_id ) REFERENCES lego_set( id ),
	FOREIGN KEY ( tag ) REFERENCES tag( id )
);

CREATE TABLE IF NOT EXISTS set_descriptor (
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
	date_updated		TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
	id 					VARCHAR (50) NOT NULL PRIMARY KEY,
	user_id				VARCHAR (50) NOT NULL,
	date_placed			TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	FOREIGN KEY ( user_id ) REFERENCES users( id )
);

CREATE TABLE IF NOT EXISTS order_items (
	order_id			VARCHAR (50) NOT NULL,
	brick_id			VARCHAR (50),
	-- colour is a modifier for the brick
	brick_colour		INT,
	set_id				VARCHAR (50),
	amount				INT NOT NULL,
	FOREIGN KEY ( order_id ) REFERENCES orders( id ),
	FOREIGN KEY ( brick_id ) REFERENCES lego_brick( id ),
	FOREIGN KEY ( brick_colour ) REFERENCES lego_brick_colour( id ),
	FOREIGN KEY ( set_id ) REFERENCES lego_set( id )
);
