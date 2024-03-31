-- drop the tables to reset the database
drop table if exists categories ;
drop table if exists subcategories;
drop table if exists owners;
drop table if exists brands;
drop table if exists brandsubcategoryjunction;

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
		    FOREIGN KEY (Category_ID) REFERENCES Categories(Category_ID) 
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
		    FOREIGN KEY (Owner_ID) REFERENCES Owners(Owner_ID) 
		    );


CREATE TABLE BrandSubcategoryJunction (
    scj_id SERIAL PRIMARY KEY,
        Brand_ID INT NOT NULL,
	    Subcategory_ID INT NOT NULL,
	        FOREIGN KEY (Brand_ID) REFERENCES Brands(Brand_ID) ,
		    FOREIGN KEY (Subcategory_ID) REFERENCES Subcategories(Subcategory_ID) 
		    );

