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
		    FOREIGN KEY (Category_ID) REFERENCES Categories2(Category_ID) ON DELETE CASCADE,
		    UNIQUE (Category_ID, Subcategory_Name)
		    );


CREATE TABLE Owners2 (
    Owner_ID SERIAL PRIMARY KEY,
        Owner VARCHAR(255) NOT NULL,
	    Ownership_Type VARCHAR(255) NOT NULL
	    );



CREATE TABLE Brands2 (
    Brand_ID SERIAL PRIMARY KEY,
        Brand VARCHAR(255) NOT NULL UNIQUE,
	    Owner_ID INT NOT NULL,
	        Notes TEXT,
		    FOREIGN KEY (Owner_ID) REFERENCES Owners2(Owner_ID) ON DELETE CASCADE,
		    UNIQUE (Brand, Owner_ID)
		    );


CREATE TABLE BrandSubcategoryJunction2 (
    scj_id SERIAL PRIMARY KEY,
        Brand_ID INT NOT NULL,
	    Subcategory_ID INT NOT NULL,
	        FOREIGN KEY (Brand_ID) REFERENCES Brands2(Brand_ID) ON DELETE CASCADE,
		    FOREIGN KEY (Subcategory_ID) REFERENCES Subcategories2(Subcategory_ID) ON DELETE
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

-- COPY command - DONT HAVE PERMISSION 
COPY staging_brands FROM '/home/mrabayda/public_html/BrandOwnership/database_csvs/ddl_source_file -
final_master-2.csv' DELIMITER ',' CSV HEADER;

-- Insert into Owners table from staging, handling duplicates
INSERT INTO Owners2 (Owner, Ownership_Type)
SELECT DISTINCT Owner, Ownership_Type
FROM staging_brands
ON CONFLICT (Owner) DO NOTHING;

-- Insert into Categories table from staging, handling duplicates
INSERT INTO Categories2 (Category_Name)
SELECT DISTINCT Category
FROM staging_brands
WHERE Category IS NOT NULL
ON CONFLICT (Category_Name) DO NOTHING;

-- Insert into Subcategories table from staging, handling duplicates
INSERT INTO Subcategories2 (Category_ID, Subcategory_Name)
SELECT DISTINCT c.Category_ID, s.Subcategory
FROM staging_brands s
JOIN Categories2 c ON s.Category = c.Category_Name
WHERE s.Subcategory IS NOT NULL
ON CONFLICT (Category_ID, Subcategory_Name) DO NOTHING;

-- Insert into Brands table from staging, handling duplicates
INSERT INTO Brands2 (Brand, Owner_ID, Notes)
SELECT DISTINCT s.Brand, o.Owner_ID, s.Notes
FROM staging_brands s
JOIN Owners2 o ON s.Owner = o.Owner
ON CONFLICT (Brand, Owner_ID) DO NOTHING;  -- Assuming a unique constraint on (Brand, Owner_ID)

-- Insert into BrandSubcategoryJunction table from staging
INSERT INTO BrandSubcategoryJunction2 (Brand_ID, Subcategory_ID)
SELECT DISTINCT b.Brand_ID, sc.Subcategory_ID
FROM staging_brands s
JOIN Brands2 b ON s.Brand = b.Brand AND s.Owner = (SELECT Owner FROM Owners2 WHERE Owner_ID = b.Owner_ID)
JOIN Subcategories2 sc ON s.Subcategory = sc.Subcategory_Name;
