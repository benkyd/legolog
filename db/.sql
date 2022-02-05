CREATE  TABLE "public".catagory ( 
	id                   integer  NOT NULL  ,
	name                 varchar(100)    ,
	CONSTRAINT catagory_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE "public".colour_type ( 
	id                   integer  NOT NULL  ,
	name                 varchar(64)    ,
	CONSTRAINT colour_type_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE "public".lego_brick_colour ( 
	id                   integer  NOT NULL  ,
	name                 varchar(100)    ,
	hexrgb               varchar(6)  NOT NULL  ,
	col_type             integer    ,
	CONSTRAINT lego_brick_colour_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE "public".lego_set ( 
	id                   varchar(50)  NOT NULL  ,
	catagory             integer    ,
	name                 varchar(100)    ,
	date_released        timestamp    ,
	dimensions_x         numeric    ,
	dimensions_y         numeric    ,
	dimensions_z         numeric    ,
	CONSTRAINT lego_set_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE "public".lego_set_inventory ( 
	id                   varchar(50)  NOT NULL  ,
	stock                integer  NOT NULL  ,
	price                numeric  NOT NULL  ,
	demand_factor        numeric  NOT NULL  ,
	backorder            boolean    ,
	backorder_stock      integer    ,
	last_updated         timestamp  NOT NULL  ,
	CONSTRAINT lego_set_inventory_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE "public".lego_set_price_history ( 
	id                   integer  NOT NULL  ,
	set_id               varchar(50)  NOT NULL  ,
	price_point          numeric  NOT NULL  ,
	date_point           timestamp  NOT NULL  ,
	CONSTRAINT lego_set_price_history_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE "public".lego_brick ( 
	id                   varchar(50)  NOT NULL  ,
	name                 varchar  NOT NULL  ,
	colour               integer    ,
	catagory             integer    ,
	weight               numeric    ,
	dimensions_x         integer    ,
	dimensions_y         integer    ,
	dimensions_z         integer    ,
	date_from            timestamp    ,
	date_to              timestamp    ,
	CONSTRAINT lego_brick_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE "public".lego_brick_inventory ( 
	id                   varchar(50)  NOT NULL  ,
	stock                integer  NOT NULL  ,
	price                numeric  NOT NULL  ,
	demand_factor        numeric  NOT NULL  ,
	backorder            boolean    ,
	backorder_stock      integer    ,
	last_updated         timestamp  NOT NULL  ,
	CONSTRAINT lego_brick_inventory_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE "public".lego_brick_price_history ( 
	id                   integer  NOT NULL  ,
	brick_id             varchar(50)  NOT NULL  ,
	price_point          numeric  NOT NULL  ,
	date_point           timestamp  NOT NULL  ,
	CONSTRAINT lego_brick_price_history_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE "public".set_descriptor ( 
	id                   varchar(50)  NOT NULL  ,
	set_id               varchar(50)  NOT NULL  ,
	brick_id             varchar(50)  NOT NULL  ,
	amount               integer    ,
	CONSTRAINT set_descriptor_pkey PRIMARY KEY ( id )
 );

ALTER TABLE "public".lego_brick ADD CONSTRAINT lego_brick_catagory_fkey FOREIGN KEY ( catagory ) REFERENCES "public".catagory( id );

ALTER TABLE "public".lego_brick ADD CONSTRAINT lego_brick_colour_fkey FOREIGN KEY ( colour ) REFERENCES "public".lego_brick_colour( id );

ALTER TABLE "public".lego_brick_colour ADD CONSTRAINT lego_brick_colour_col_type_fkey FOREIGN KEY ( col_type ) REFERENCES "public".colour_type( id );

ALTER TABLE "public".lego_brick_inventory ADD CONSTRAINT lego_brick_inventory_id_fkey FOREIGN KEY ( id ) REFERENCES "public".lego_brick( id );

ALTER TABLE "public".lego_brick_price_history ADD CONSTRAINT lego_brick_price_history_brick_id_fkey FOREIGN KEY ( brick_id ) REFERENCES "public".lego_brick( id );

ALTER TABLE "public".lego_set ADD CONSTRAINT lego_set_catagory_fkey FOREIGN KEY ( catagory ) REFERENCES "public".catagory( id );

ALTER TABLE "public".lego_set_inventory ADD CONSTRAINT lego_set_inventory_id_fkey FOREIGN KEY ( id ) REFERENCES "public".lego_set( id );

ALTER TABLE "public".lego_set_price_history ADD CONSTRAINT lego_set_price_history_set_id_fkey FOREIGN KEY ( set_id ) REFERENCES "public".lego_set( id );

ALTER TABLE "public".set_descriptor ADD CONSTRAINT set_descriptor_brick_id_fkey FOREIGN KEY ( brick_id ) REFERENCES "public".lego_brick( id );

ALTER TABLE "public".set_descriptor ADD CONSTRAINT set_descriptor_set_id_fkey FOREIGN KEY ( set_id ) REFERENCES "public".lego_set( id );

