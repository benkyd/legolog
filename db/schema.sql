CREATE TABLE LegoBrickInventory ( 
	id                   varchar(50)
 );

CREATE TABLE LegoSetInventory ( 
	id                   varchar(50)
 );

CREATE TABLE Catagory ( 
	id                   integer NOT NULL  PRIMARY KEY  ,
	name                 varchar(100)     
 );

CREATE TABLE ColourType ( 
	id                   integer NOT NULL  PRIMARY KEY  ,
	name                 varchar(64)     
 );

CREATE TABLE LegoBrickColour ( 
	id                   integer NOT NULL  PRIMARY KEY  ,
	name                 varchar(100)     ,
	hexrgb               varchar(6) NOT NULL    ,
	col_type             integer     ,
	FOREIGN KEY ( col_type ) REFERENCES ColourType( id )  
 );

CREATE TABLE LegoSet ( 
	id                   varchar(50) NOT NULL  PRIMARY KEY  ,
	catagory             integer     ,
	name                 varchar(100)     ,
	date_released        date     ,
	dimensions_x         decimal     ,
	dimensions_y         decimal     ,
	dimensions_z         decimal     ,
	FOREIGN KEY ( catagory ) REFERENCES Catagory( id )  
 );

CREATE TABLE LegoBrick ( 
	id                   varchar(50) NOT NULL  PRIMARY KEY  ,
	name                 text(100) NOT NULL    ,
	colour               integer     ,
	catagory             integer     ,
	weight               decimal     ,
	dimensions_x         integer     ,
	dimensions_y         integer     ,
	dimensions_z         integer     ,
	date_from            date     ,
	date_to              date     ,
	FOREIGN KEY ( colour ) REFERENCES LegoBrickColour( id )  ,
	FOREIGN KEY ( catagory ) REFERENCES Catagory( id )  
 );

CREATE TABLE SetDescriptor ( 
	id                   varchar(50) NOT NULL  PRIMARY KEY  ,
	set_id               varchar(50) NOT NULL    ,
	brick_id             varchar(50) NOT NULL    ,
	amount               integer     ,
	FOREIGN KEY ( set_id ) REFERENCES LegoSet( id )  ,
	FOREIGN KEY ( brick_id ) REFERENCES LegoBrick( id )  
 );

