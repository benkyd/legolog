CREATE TABLE Catagory ( 
	id                   integer NOT NULL  PRIMARY KEY  ,
	name                 varchar(100)     
 );

CREATE TABLE ColourType ( 
	id                   integer NOT NULL  PRIMARY KEY  ,
	"type"               varchar(64)     
 );

CREATE TABLE "Set" ( 
	id                   varchar(20) NOT NULL    ,
	catagory             integer     ,
	name                 varchar(100)     ,
	date_released        date     ,
	dimensions_x         decimal     ,
	dimensions_y         decimal     ,
	dimensions_z         decimal     ,
	FOREIGN KEY ( catagory ) REFERENCES Catagory( id )  
 );

CREATE TABLE BrickColour ( 
	id                   integer NOT NULL  PRIMARY KEY  ,
	name                 varchar(100)     ,
	hexrgb               varchar(6) NOT NULL    ,
	"type"               integer     ,
	date_from            date     ,
	date_to              date     ,
	FOREIGN KEY ( "type" ) REFERENCES ColourType( id )  
 );

CREATE TABLE Brick ( 
	id                   varchar(20) NOT NULL  PRIMARY KEY  ,
	name                 text(100) NOT NULL    ,
	colour               integer     ,
	catagory             integer     ,
	weight               decimal     ,
	dimensions_x         integer     ,
	dimensions_y         integer     ,
	dimensions_z         integer     ,
	FOREIGN KEY ( colour ) REFERENCES BrickColour( id )  ,
	FOREIGN KEY ( catagory ) REFERENCES Catagory( id )  
 );

