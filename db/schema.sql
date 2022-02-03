CREATE TABLE IF NOT EXISTS LegoBrickPriceHistory (
	id 					INT NOT NULL PRIMARY KEY AUTOINCREMENT,
	brick_id 			INT NOT NULL,
	price_point			DECIMAL NOT NULL,
	date_point 			DATETIME NOT NULL,
	FOREIGN KEY ( id ) REFERENCES LegoBrick( id )
);

CREATE TABLE IF NOT EXISTS LegoSetPriceHistory (
	id 					INT NOT NULL PRIMARY KEY AUTOINCREMENT,
	set_id 				INT NOT NULL,
	price_point			DECIMAL NOT NULL,
	date_point 			DATETIME NOT NULL,
	FOREIGN KEY ( id ) REFERENCES LegoSet( id )
);

CREATE TABLE IF NOT EXISTS LegoBrickInventory (
	id                  VARCHAR (50) NOT NULL PRIMARY KEY,
	stock				INT NOT NULL,
	price				DECIMAL NOT NULL,
	demand_factor		DECIMAL NOT NULL,
	backorder 		  	BOOLEAN,
	backorder_stock	  	INT,
	last_updated		DATETIME NOT NULL
	FOREIGN KEY ( id ) REFERENCES LegoBrick( id )
);

CREATE TABLE IF NOT EXISTS LegoSetInventory (
	id                  VARCHAR (50) NOT NULL PRIMARY KEY,
	stock				INT NOT NULL,
	price				DECIMAL NOT NULL,
	demand_factor		DECIMAL NOT NULL,
	backorder 		  	BOOLEAN,
	backorder_stock	  	INT,
	last_updated		DATETIME NOT NULL
	FOREIGN KEY ( id ) REFERENCES LegoSet( id )
);

CREATE TABLE IF NOT EXISTS Catagory (
	id                   INT NOT NULL PRIMARY KEY,
	name                 VARCHAR (100)   
);

CREATE TABLE IF NOT EXISTS ColourType (
	id                   INT NOT NULL PRIMARY KEY,
	name                 VARCHAR (64)
);

CREATE TABLE IF NOT EXISTS LegoBrickColour (
	id                   INT NOT NULL PRIMARY KEY,
	name                 VARCHAR (100),
	hexrgb               VARCHAR (6) NOT NULL,
	col_type             INT,
	FOREIGN KEY ( col_type ) REFERENCES ColourType( id )
);

CREATE TABLE IF NOT EXISTS LegoSet (
	id                   VARCHAR (50) NOT NULL PRIMARY KEY,
	catagory             INT,
	name                 VARCHAR (100),
	date_released        DATETIME,
	dimensions_x         DECIMAL,
	dimensions_y         DECIMAL,
	dimensions_z         DECIMAL,
	FOREIGN KEY ( catagory ) REFERENCES Catagory( id ),
	FOREIGN KEY ( id ) REFERENCES LegoSetInventory( id )
);

CREATE TABLE IF NOT EXISTS LegoBrick (
	id                   VARCHAR (50) NOT NULL PRIMARY KEY,
	name                 TEXT(100) NOT NULL,
	colour               INT,
	catagory             INT,
	weight               DECIMAL,
	dimensions_x         INT,
	dimensions_y         INT,
	dimensions_z         INT,
	date_from            DATETIME,
	date_to              DATETIME,
	FOREIGN KEY ( colour ) REFERENCES LegoBrickColour( id ),
	FOREIGN KEY ( catagory ) REFERENCES Catagory( id )
);

CREATE TABLE IF NOT EXISTS SetDescriptor (
	id                   VARCHAR (50) NOT NULL PRIMARY KEY,
	set_id               VARCHAR (50) NOT NULL,
	brick_id             VARCHAR (50) NOT NULL,
	amount               INT,
	FOREIGN KEY ( set_id ) REFERENCES LegoSet( id ),
	FOREIGN KEY ( brick_id ) REFERENCES LegoBrick( id )
);
