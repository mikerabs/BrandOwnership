-- drop the tables to reset the database
drop table if exists staging_brands cascade;
drop table if exists categories2 cascade;
drop table if exists subcategories2 cascade;
drop table if exists owners2 cascade;
drop table if exists brands2 cascade;
drop table if exists brandsubcategoryjunction2 cascade;

--then create the schemas
CREATE TABLE Categories2 (
    Category_ID SERIAL PRIMARY KEY,
        Category_Name VARCHAR(255) NOT NULL UNIQUE,
	    Description TEXT
	    );

CREATE TABLE Subcategories2 (
    Subcategory_ID SERIAL PRIMARY KEY,
        Category_ID INT NOT NULL,
	    Subcategory_Name VARCHAR(255) NOT NULL,
	        Description TEXT,
		    FOREIGN KEY (Category_ID) REFERENCES Categories2(Category_ID) ON DELETE CASCADE
		    );


CREATE TABLE Owners2 (
    Owner_ID SERIAL PRIMARY KEY,
        Owner VARCHAR(255) NOT NULL,
	    Ownership_Type VARCHAR(255) NOT NULL
	    );



CREATE TABLE Brands2 (
    Brand_ID SERIAL PRIMARY KEY,
        Brand VARCHAR(255) NOT NULL,
	    Owner_ID INT NOT NULL,
	        Notes TEXT,
		    FOREIGN KEY (Owner_ID) REFERENCES Owners2(Owner_ID) ON DELETE CASCADE
		    );


CREATE TABLE BrandSubcategoryJunction2 (
    scj_id SERIAL PRIMARY KEY,
        Brand_ID INT NOT NULL,
	    Subcategory_ID INT NOT NULL,
	        FOREIGN KEY (Brand_ID) REFERENCES Brands2(Brand_ID) ON DELETE CASCADE,
		    FOREIGN KEY (Subcategory_ID) REFERENCES Subcategories2(Subcategory_ID) ON DELETE CASCADE
		    );

-- Create table constraints using ALTER
ALTER TABLE Subcategories2 ADD UNIQUE (Category_ID, Subcategory_Name);
ALTER TABLE Brands2 ADD UNIQUE (Brand, Owner_ID);
ALTER TABLE Owners2 ADD UNIQUE (Owner);  -- Add this if not implicitly declared during creation.
ALTER TABLE BrandSubcategoryJunction2 ADD UNIQUE (Brand_ID, Subcategory_ID);  -- Optional if you expect uniqueness



-- Load data into temporary staging table
CREATE TABLE staging_brands (
    Brand VARCHAR(255),
    Owner VARCHAR(255),
    Ownership_Type VARCHAR(255),
    Notes TEXT,
    Category VARCHAR(255),
    Subcategory VARCHAR(255)
);

-- COPY command - DONT HAVE PERMISSION 
--COPY staging_brands FROM '/home/mrabayda/public_html/BrandOwnership/database_csvs/ddl_source_file -
--final_master-2.csv' DELIMITER ',' CSV HEADER;
