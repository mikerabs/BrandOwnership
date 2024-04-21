-- drop the tables to reset the database
drop table if exists categories cascade;
drop table if exists subcategories cascade;
drop table if exists owners cascade;
drop table if exists brands cascade;
drop table if exists brandsubcategoryjunction cascade;

--then create the schemas
CREATE TABLE Categories (
    Category_ID SERIAL PRIMARY KEY,
        Category_Name VARCHAR(255) NOT NULL UNIQUE,
	    Description TEXT
	    );

CREATE TABLE Subcategories (
    Subcategory_ID SERIAL PRIMARY KEY,
        Category_ID INT NOT NULL,
	    Subcategory_Name VARCHAR(255) NOT NULL,
	        Description TEXT,
		    FOREIGN KEY (Category_ID) REFERENCES Categories(Category_ID) ON DELETE CASCADE
		    );


CREATE TABLE Owners (
    Owner_ID SERIAL PRIMARY KEY,
        Owner VARCHAR(255) NOT NULL,
	    Ownership_Type VARCHAR(255) NOT NULL
	    );



CREATE TABLE Brands (
    Brand_ID SERIAL PRIMARY KEY,
        Brand VARCHAR(255) NOT NULL UNIQUE,
	    Owner_ID INT NOT NULL,
	        Notes TEXT,
		    FOREIGN KEY (Owner_ID) REFERENCES Owners(Owner_ID) ON DELETE CASCADE
		    );


CREATE TABLE BrandSubcategoryJunction (
    scj_id SERIAL PRIMARY KEY,
        Brand_ID INT NOT NULL,
	    Subcategory_ID INT NOT NULL,
	        FOREIGN KEY (Brand_ID) REFERENCES Brands(Brand_ID) ON DELETE CASCADE,
		    FOREIGN KEY (Subcategory_ID) REFERENCES Subcategories(Subcategory_ID) ON DELETE
		    CASCADE
		    );


-- Load data into temporary staging table
CREATE TEMP TABLE staging_brands (
    Brand VARCHAR(255),
    Owner VARCHAR(255),
    Ownership_Type VARCHAR(255),
    Notes TEXT,
    Category VARCHAR(255),
    Subcategory VARCHAR(255)
);

-- Use the COPY command if using PostgreSQL
COPY staging_brands FROM '/path_to_your_file/brands.csv' DELIMITER ',' CSV HEADER;

-- Insert into Owners table from staging, handling duplicates
INSERT INTO Owners (Owner, Ownership_Type)
SELECT DISTINCT Owner, Ownership_Type
FROM staging_brands
ON CONFLICT (Owner) DO NOTHING;

-- Insert into Categories table from staging, handling duplicates
INSERT INTO Categories (Category_Name)
SELECT DISTINCT Category
FROM staging_brands
WHERE Category IS NOT NULL
ON CONFLICT (Category_Name) DO NOTHING;

-- Insert into Subcategories table from staging, handling duplicates
INSERT INTO Subcategories (Category_ID, Subcategory_Name)
SELECT DISTINCT c.Category_ID, s.Subcategory
FROM staging_brands s
JOIN Categories c ON s.Category = c.Category_Name
WHERE Subcategory IS NOT NULL
ON CONFLICT (Subcategory_Name) DO NOTHING;

-- Insert into Brands table from staging, handling duplicates
INSERT INTO Brands (Brand, Owner_ID, Notes)
SELECT DISTINCT s.Brand, o.Owner_ID, s.Notes
FROM staging_brands s
JOIN Owners o ON s.Owner = o.Owner
ON CONFLICT (Brand) DO NOTHING;

-- Insert into BrandSubcategoryJunction table from staging
INSERT INTO BrandSubcategoryJunction (Brand_ID, Subcategory_ID)
SELECT b.Brand_ID, sc.Subcategory_ID
FROM staging_brands s
JOIN Brands b ON s.Brand = b.Brand
JOIN Subcategories sc ON s.Subcategory = sc.Subcategory_Name;

